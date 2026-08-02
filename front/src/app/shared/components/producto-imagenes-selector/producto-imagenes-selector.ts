import { Component, signal } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { Plus, Upload, Trash, Times } from '@primeicons/angular';

export interface ImagenSlot {
  id: string;
  file?: File;
  url: string;
  nombre: string;
  esExistente: boolean;
}

@Component({
  selector: 'app-producto-imagenes-selector',
  imports: [FileUploadModule, ButtonModule, Plus, Upload, Times, Trash],
  templateUrl: './producto-imagenes-selector.html',
  styleUrl: './producto-imagenes-selector.css',
})
export class ProductoImagenesSelector {
  slots = signal<(ImagenSlot | null)[]>([null, null, null, null, null]);

  dragOverIndex = signal<number | null>(null);
  public draggedSlotIndex = signal<number | null>(null);

  // Carga desde explorador de archivos
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.procesarArchivos(Array.from(input.files));
    input.value = ''; // Limpia para re-seleccionar el mismo archivo si es necesario
  }

  // Inicio de Drag interno
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

    // Si vienen archivos del sistema de archivos local (PC)
    if (event.dataTransfer?.files?.length) {
      this.procesarArchivos(Array.from(event.dataTransfer.files), targetIndex);
      return;
    }
    const draggedSlotIndex = this.draggedSlotIndex();
    // Si se reordenan dentro de los 5 slots
    if (draggedSlotIndex !== null && draggedSlotIndex !== targetIndex) {
      const actual = [...this.slots()];
      const temp = actual[targetIndex];
      actual[targetIndex] = actual[draggedSlotIndex];
      actual[draggedSlotIndex] = temp;

      this.slots.set(actual);
      this.draggedSlotIndex.set(null);
    }
  }

  private procesarArchivos(archivos: File[], targetIndex?: number) {
    const actual = [...this.slots()];

    // Si cayó sobre un slot libre específico
    if (targetIndex !== undefined && !actual[targetIndex]) {
      const file = archivos.shift();
      if (file) actual[targetIndex] = this.crearSlot(file);
    }

    // Colocar el resto en las primeras casillas vacías disponibles
    archivos.forEach((file) => {
      const vacio = actual.findIndex((s) => s === null);
      if (vacio !== -1) {
        actual[vacio] = this.crearSlot(file);
      }
    });

    this.slots.set(actual);
  }

  private crearSlot(file: File): ImagenSlot {
    return {
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      nombre: file.name,
      esExistente: false,
    };
  }

  eliminarSlot(index: number) {
    const actual = [...this.slots()];
    const item = actual[index];

    if (item && !item.esExistente && item.url.startsWith('blob:')) {
      URL.revokeObjectURL(item.url);
    }

    actual[index] = null;
    this.slots.set(actual);
  }
}
