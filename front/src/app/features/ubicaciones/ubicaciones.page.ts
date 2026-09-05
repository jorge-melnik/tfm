import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  resource,
  signal,
  viewChild,
} from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { DepartamentosService } from '@shared/services/departamentos.service';
import { UserStore } from '@shared/services/stores/user.store';
import { UsuariosService } from '@shared/services/usuarios.service.ts';
import { Departamento, Localidad, Ubicacion, ubicacionVacia } from '@shared/types/ubicacion';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, transform } from 'ol/proj';
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';
import { boundingExtent } from 'ol/extent';
import { defaults as defaultControls } from 'ol/control/defaults';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule, Dialog } from 'primeng/dialog';
import {
  MapMarker,
  Plus,
  Trash,
  Pencil,
  RectangleXmark,
  Times,
  Save,
  ArrowLeft,
} from '@primeicons/angular';
import Overlay from 'ol/Overlay';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { LocalidadsService } from '@shared/services/localidades.service';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ubicaciones',
  imports: [
    CardModule,
    ButtonModule,
    SelectModule,
    MapMarker,
    Trash,
    Pencil,
    ArrowLeft,
    Save,
    Times,
    Dialog,
    TextareaModule,
    InputTextModule,
    FloatLabelModule,
    SelectModule,
    FormField,
    Plus,
    FormsModule,
  ],
  templateUrl: './ubicaciones.page.html',
  styleUrl: './ubicaciones.page.css',
})
export class UbicacionesPage {
  private _departamentosService = inject(DepartamentosService);
  private _localidadesService = inject(LocalidadsService);
  private _usuariosService = inject(UsuariosService);
  public readonly location = inject(Location);
  public userStore = inject(UserStore);

  public ubicacionSeleccionada = signal<Ubicacion>(ubicacionVacia);
  public modalEdicionAbierto = signal<boolean>(false);
  public guardandoEdicion = signal<boolean>(false);
  public modoSeleccionActivo = signal<boolean>(false);
  public esNuevaUbicacion = computed<boolean>(() => !this.ubicacionSeleccionada()?.id_ubicacion);

  public ubicacionForm = form(this.ubicacionSeleccionada, (schemaPath) => {
    required(schemaPath.id_usuario);
    required(schemaPath.id_localidad);
    required(schemaPath.id_departamento);
    required(schemaPath.nombre);
    required(schemaPath.direccion);
    required(schemaPath.latitud);
    required(schemaPath.longitud);
  });

  private ubicacionesResource = resource({
    params: () => {
      const username = this.userStore.user()?.username;
      if (!username) return undefined;
      return { username };
    },
    loader: async ({ params }) => {
      const { username } = params;
      return this._usuariosService.getUbicaciones(username);
    },
  });

  private departamentosResource = resource({
    loader: () => this._departamentosService.getAll(),
  });

  private localidadesResource = resource({
    params: () => {
      const id_departamento = this.ubicacionSeleccionada().id_departamento;
      const departamento = this.departamentos().find((d) => d.id_departamento === id_departamento); //FIXME: Esto porque en el template no me deja departamento
      if (!departamento) return undefined;
      return { departamento };
    },
    loader: async ({ params }) => {
      const { departamento } = params;
      return this._localidadesService.getAll({ departamento: departamento.departamento });
    },
  });

  public ubicaciones = computed(() => this.ubicacionesResource.value() ?? []);
  public departamentos = computed<Departamento[]>(() => this.departamentosResource.value() ?? []);
  public localidades = computed<Localidad[] | undefined>(() => this.localidadesResource.value());
  public cargando = computed(() => this.ubicacionesResource.isLoading());

  private map!: Map;
  private vectorSource = new VectorSource();
  private vectorLayer = new VectorLayer({ source: this.vectorSource });
  private popupOverlay?: Overlay; // <--- Instancia de Overlay

  public mapContainer = viewChild<ElementRef<HTMLDivElement>>('mapContainer');
  public popupContainer = viewChild<ElementRef<HTMLDivElement>>('popupContainer'); // <--- ViewChild del popup

  constructor() {
    effect(() => {
      const lista = this.ubicaciones();
      if (this.map && lista.length > 0) {
        this.renderizarMarcadores(lista);
      }
    });
  }

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  public activarModoNuevaUbicacion() {
    this.modoSeleccionActivo.set(true);
    // Cambiamos el cursor del mapa para indicar interacción
    if (this.map) {
      this.map.getTargetElement().style.cursor = 'crosshair';
    }
  }

  async alSeleccionarPuntoEnMapa(coordinate: number[]) {
    const [longitud, latitud] = transform(coordinate, 'EPSG:3857', 'EPSG:4326');

    this.modoSeleccionActivo.set(false);
    this.map.getTargetElement().style.cursor = '';

    let nuevaUbicacion: Ubicacion = await this._localidadesService.getNuevaUbicacionFromCoordenada(
      latitud,
      longitud,
    );
    nuevaUbicacion = {
      ...nuevaUbicacion,
      latitud,
      longitud,
    };

    this.ubicacionSeleccionada.set(nuevaUbicacion);

    this.modalEdicionAbierto.set(true);
  }

  private inicializarMapa(): void {
    const mapContainer = this.mapContainer();
    const popupContainer = this.popupContainer();
    if (!mapContainer || !popupContainer) return;

    this.popupOverlay = new Overlay({
      element: popupContainer.nativeElement,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
      positioning: 'bottom-center',
      stopEvent: true,
      offset: [0, -45],
    });

    this.map = new Map({
      target: mapContainer.nativeElement,
      overlays: [this.popupOverlay],
      controls: defaultControls({
        zoom: false,
        rotate: false,
        attribution: true,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.vectorLayer,
      ],
      view: new View({
        center: fromLonLat([-56.164532, -34.901113]),
        zoom: 7,
      }),
    });

    this.map.on('click', async (event) => {
      const feature = this.map?.forEachFeatureAtPixel(event.pixel, (feat) => feat);

      if (feature) {
        const ubicacionData = feature.get('ubicacionData') as Ubicacion;
        const geometry = feature.getGeometry() as Point;
        const coordinate = geometry.getCoordinates();
        const [longitud, latitud] = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
        // let nuevaUbicacion: Ubicacion =
        //   await this._localidadesService.getNuevaUbicacionFromCoordenada(latitud, longitud);

        this.ubicacionSeleccionada.set({ ...ubicacionData });
        this.popupOverlay?.setPosition(coordinate);
      } else {
        // Si hace clic fuera de un pincho, oculta el popup
        this.cerrarPopup();
      }
    });

    // Cambiar cursor al pasar sobre un pincho
    this.map.on('pointermove', (e) => {
      if (!this.map) return;
      const hit = this.map.hasFeatureAtPixel(e.pixel);
      this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    this.map.on('singleclick', (evt: MapBrowserEvent<any>) => {
      if (this.modoSeleccionActivo()) {
        this.alSeleccionarPuntoEnMapa(evt.coordinate);
      }
    });

    if (this.ubicaciones().length > 0) {
      this.renderizarMarcadores(this.ubicaciones());
    }
  }

  private renderizarMarcadores(listaUbicaciones: Ubicacion[]): void {
    this.vectorSource.clear();
    this.cerrarPopup(); // Limpiar popup previo si hay rerender

    const coordenadasExtent: number[][] = [];

    listaUbicaciones.forEach((u) => {
      const lat = u.latitud;
      const lng = u.longitud;

      if (isNaN(lat) || isNaN(lng)) return;

      const coordMercator = fromLonLat([lng, lat]);
      coordenadasExtent.push(coordMercator);

      const feature = new Feature({
        geometry: new Point(coordMercator),
      });

      feature.set('ubicacionData', u);

      feature.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            scale: 0.07,
          }),
          text: new Text({
            text: u.nombre,
            font: 'bold 13px sans-serif',
            offsetY: -45,
            fill: new Fill({ color: '#111827' }),
            stroke: new Stroke({ color: '#ffffff', width: 3 }),
          }),
        }),
      );

      this.vectorSource.addFeature(feature);
    });

    if (coordenadasExtent.length > 0) {
      const extent = boundingExtent(coordenadasExtent);
      this.map?.getView().fit(extent, {
        padding: [80, 80, 80, 80],
        maxZoom: 15,
        duration: 800,
      });
    }
  }

  public cerrarPopup(): void {
    // Al setear en undefined el Overlay se oculta automáticamente
    this.popupOverlay?.setPosition(undefined);
    this.ubicacionSeleccionada.set(ubicacionVacia);
  }

  public editarUbicacion(ubicacion: Ubicacion): void {
    this.ubicacionSeleccionada.set({ ...ubicacion });
    this.modalEdicionAbierto.set(true);
  }

  public cerrarModalEdicion() {
    this.modalEdicionAbierto.set(false);
  }
  public async guardarEdicion(): Promise<void> {
    const user = this.userStore.user();
    if (!user) return;
    this.ubicacionSeleccionada.set({
      ...this.ubicacionSeleccionada(),
      id_usuario: this.userStore.user()?.id_usuario || '',
    });
    const datosFormulario = this.ubicacionSeleccionada();
    console.log({ datosFormulario });
    if (this.ubicacionForm().invalid()) {
      console.warn('El formulario contiene campos requeridos vacíos');
      return;
    }

    this.guardandoEdicion.set(true);

    try {
      if (this.esNuevaUbicacion()) {
        console.log('Creando nueva ubicación:', datosFormulario);
        await this._usuariosService.addUbicacion(user.username, datosFormulario);
      } else {
        if (!datosFormulario.id_ubicacion) return;

        console.log('Actualizando ubicación existente:', datosFormulario);

        await this._usuariosService.updateUbicacion(
          user.username,
          datosFormulario.ubicacion,
          datosFormulario,
        );
      }

      this.ubicacionesResource.reload();
      this.cerrarModalEdicion();
      this.cerrarPopup();
    } catch (error) {
      console.error('Error al procesar la ubicación:', error);
    } finally {
      this.guardandoEdicion.set(false);
    }
  }

  cancelarSeleccion() {
    this.modoSeleccionActivo.set(false);
    if (this.map) {
      this.map.getTargetElement().style.cursor = '';
    }
  }

  public eliminarUbicacion(ubicacion: Ubicacion): void {
    console.log('Eliminar ubicación:', ubicacion);
  }
}
