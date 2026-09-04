import { Service } from '@angular/core';
import { environment } from '@env/environment';
import { BaseService } from './base-service.service';
import { firstValueFrom } from 'rxjs';
import { Departamento, Localidad } from '@shared/types/ubicacion';

@Service()
export class DepartamentosService extends BaseService<Departamento> {
  protected override serviceUrl: string = `${environment.apiUrl}/departamentos`;
}
