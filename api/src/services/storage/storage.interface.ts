export interface PresignedUrlResponse {
  uploadUrl: string; // URL donde el frontend subirá la foto
  publicUrl: string; // URL pública para guardar en la base de datos
}

export interface IStorageService {
  getPresignedUploadUrl(fileName: string, mimeType: string): Promise<PresignedUrlResponse>;
}
