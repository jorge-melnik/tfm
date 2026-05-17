import { LocalStorageService } from './local-storage.service.js';
import { IStorageService } from './storage.interface.js';

export class StorageFactory {
  static getProvider(): IStorageService {
    // Por ahora, como estamos en local, siempre devolvemos el LocalStorage
    return new LocalStorageService();
  }
}

export const storageService = StorageFactory.getProvider();
