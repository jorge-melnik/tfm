import { Component, signal } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { Plus } from '@primeicons/angular/plus';
import { Upload } from '@primeicons/angular/upload';
import { Times } from '@primeicons/angular/times';

export interface ImagenProductoItem {
  id: string; // ID único local para el @for track
  file?: File; // Objeto File si es una imagen recién elegida
  url: string; // URL para la vista previa (blob local o URL pública de S3)
  nombre: string;
  esExistente: boolean; // true si ya estaba guardada en S3
}

@Component({
  selector: 'app-producto-imagenes-selector',
  imports: [FileUploadModule, ButtonModule, Plus, Upload, Times],
  templateUrl: './producto-imagenes-selector.html',
  styleUrl: './producto-imagenes-selector.css',
})
export class ProductoImagenesSelector {}
