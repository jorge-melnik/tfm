import { IStorageService, PresignedUrlResponse } from './storage.interface.js';

export class LocalStorageService implements IStorageService {
  async getPresignedUploadUrl(fileName: string, mimeType: string): Promise<PresignedUrlResponse> {
    const uniqueName = `${Date.now()}-${fileName}`;

    // Apunta a los endpoints que crearemos en tu propio Fastify local
    return {
      uploadUrl: `http://localhost:3000/api/storage/local-upload/${uniqueName}`,
      publicUrl: `http://localhost:3000/uploads/${uniqueName}`,
    };
  }
}
