import { Component, input, model, OnInit, signal } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { Plus, Trash } from '@primeicons/angular';
import { ImagenSlot, Producto } from '@shared/types/producto';
import { environment } from '@env/environment';

@Component({
  selector: 'app-producto-imagenes-selector',
  imports: [FileUploadModule, ButtonModule, Plus, Trash],
  templateUrl: './producto-imagenes-selector.html',
  styleUrl: './producto-imagenes-selector.css',
})
export class ProductoImagenesSelector implements OnInit {
  public producto = input.required<Producto>();
  public slots = model.required<ImagenSlot[]>();
  public cdnUrl = environment.cdnUrl;

  dragOverIndex = signal<number | null>(null);
  public draggedSlotIndex = signal<number | null>(null);

  ngOnInit(): void {
    const slotsIniciales: ImagenSlot[] = this.producto().fotos.map((foto) => ({
      posicion: foto.posicion,
      path: foto.path,
      existente: true,
    }));
    const cantidadImagenes = slotsIniciales.length;
    for (let i = cantidadImagenes; i < 5; i++) {
      console.log({ cantidadImagenes, i });
      slotsIniciales.push({
        posicion: i + 1,
        path: '',
        existente: false,
      });
    }
    this.slots.set(slotsIniciales);
    // this.slots.set([...slotsIniciales, ...Array(5 - slotsIniciales.length).fill(null)]);
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.procesarArchivos(Array.from(input.files));
    input.value = '';
  }

  onDragStart(event: DragEvent, index: number) {
    this.draggedSlotIndex.set(index);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.dragOverIndex.set(index);
  }

  onDragLeave() {
    this.dragOverIndex.set(null);
  }

  // Drop: maneja tanto soltar archivos externos como mover slots internos
  onDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault();
    this.dragOverIndex.set(null);

    if (event.dataTransfer?.files?.length) {
      // Si vienen archivos del sistema de archivos local (PC)
      this.procesarArchivos(Array.from(event.dataTransfer.files), targetIndex);
      return;
    }
    const draggedSlotIndex = this.draggedSlotIndex();

    if (draggedSlotIndex === null) return;
    if (draggedSlotIndex === targetIndex) return;

    const actual = [...this.slots()];
    const destino: ImagenSlot = actual[targetIndex];
    const origen: ImagenSlot = actual[draggedSlotIndex];

    destino.posicion = draggedSlotIndex + 1;
    origen.posicion = targetIndex + 1;

    actual[targetIndex] = origen;
    actual[draggedSlotIndex] = destino;

    this.slots.set(actual);
    this.draggedSlotIndex.set(null);

    const slots = this.slots();
    console.log({ slots });
  }

  private procesarArchivos(archivos: File[], targetIndex?: number) {
    const actual: ImagenSlot[] = [...this.slots()];

    const asignarArchivoASlot = (slot: ImagenSlot, file: File) => {
      if (slot.path && slot.path.startsWith('blob:')) {
        // Si ya tenía una URL de blob anterior en este slot, liberamos la memoria
        URL.revokeObjectURL(slot.path);
      }
      slot.file = file;
      slot.path = URL.createObjectURL(file); // Url temporal para vista previa
      slot.existente = false;
    };

    if (targetIndex !== undefined) {
      // Si se soltó sobre un slot específico que NO tiene archivo cargado ni es existente
      const destino = actual[targetIndex];
      if (destino && !destino.file && !destino.existente) {
        const file = archivos.shift(); //Tomamos y sacamos el primero del array.
        if (file) {
          asignarArchivoASlot(destino, file); //En este caso NO hay nada en el destino.
        }
      }
    }

    //Colocar el resto de archivos en las primeras casillas vacías disponibles.
    archivos.forEach((file) => {
      const destino = actual.find((slot) => !slot.file && !slot.existente);
      if (destino) {
        asignarArchivoASlot(destino, file);
      }
    });

    this.slots.set(actual);
  }

  eliminarSlot(index: number) {
    const slots = [...this.slots()];
    const item = slots[index];
    if (!item) return;

    // Si es un Blob generado localmente, liberamos memoria
    if (item.path && item.path.startsWith('blob:')) {
      URL.revokeObjectURL(item.path);
    }

    // Reseteamos el slot a su estado libre inicial
    slots[index] = {
      posicion: index + 1,
      existente: false, //Si se borró una existente no importa. va a ir vacía y eliminarse de la bd
      file: undefined,
      path: '',
    };

    this.slots.set(slots);
  }
}
