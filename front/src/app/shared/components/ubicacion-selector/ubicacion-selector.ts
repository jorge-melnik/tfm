import {
  Component,
  ElementRef,
  OnInit,
  input,
  output,
  viewChild,
  effect,
  model,
} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Translate } from 'ol/interaction';

@Component({
  selector: 'app-ubicacion-selector',
  imports: [],
  templateUrl: './ubicacion-selector.html',
  styleUrl: './ubicacion-selector.css',
})
export class UbicacionSelector implements OnInit {
  mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  // Entradas: latitud y longitud iniciales (por defecto centro en Salto/Uruguay)
  latitud = model.required<number>();
  longitud = model.required<number>();

  // Salida cuando el usuario arrastra o cambia el marcador
  coordenadasChange = output<{ lat: number; lng: number }>();

  private map!: Map;
  private vectorSource = new VectorSource();
  private markerFeature!: Feature<Point>;

  constructor() {
    // Reaccionar si cambian los inputs desde el padre
    effect(() => {
      const lat = this.latitud();
      const lng = this.longitud();
      if (this.markerFeature) {
        const coordsProj = fromLonLat([lng, lat]);
        this.markerFeature.setGeometry(new Point(coordsProj));
        this.map.getView().setCenter(coordsProj);
      }
    });
  }

  ngOnInit() {
    this.initMap();
  }

  private initMap() {
    const centerProj = fromLonLat([this.longitud(), this.latitud()]);

    // Crear la feature del pin
    this.markerFeature = new Feature({
      geometry: new Point(centerProj),
    });

    this.vectorSource.addFeature(this.markerFeature);

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    // Inicializar mapa de OpenLayers (ESM Nativo)
    this.map = new Map({
      target: this.mapContainer().nativeElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: centerProj,
        zoom: 14,
      }),
    });

    // Permitir arrastrar el pin (Interaction Translate)
    const translate = new Translate({
      features: this.vectorSource.getFeaturesCollection()!,
    });

    translate.on('translateend', (evt) => {
      const geom = evt.features.item(0).getGeometry() as Point;
      const [lng, lat] = toLonLat(geom.getCoordinates());
      this.coordenadasChange.emit({
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
      });
    });

    this.map.addInteraction(translate);

    // Mover el pin al hacer click en cualquier parte del mapa
    this.map.on('click', (evt) => {
      const [lng, lat] = toLonLat(evt.coordinate);
      this.markerFeature.setGeometry(new Point(evt.coordinate));
      this.coordenadasChange.emit({
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
      });
    });
  }
}
