import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';
import { TypeVehicule, TypeVehiculeCreate } from '../models/type-vehicule.model';
import { EndpointConfig } from '../config/endpoint';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TypeVehiculeService {
  protected readonly http = inject(HttpClient);
  private readonly baseUrl = EndpointConfig.BASE_URL + '/types-vehicules';
  private readonly auth = inject(AuthService);
  private readonly items$ = new BehaviorSubject<TypeVehicule[]>([]);

  getAll(): Observable<TypeVehicule[]> {
    return this.items$.asObservable();
  }

  load() {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };
    return this.http.get<TypeVehicule[]>(this.baseUrl, { headers }).pipe(tap(items => this.items$.next(items ?? [])));
  }

  async create(payload: TypeVehiculeCreate) {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };
    const created = await firstValueFrom(this.http.post<TypeVehicule>(this.baseUrl, payload, { headers }));
    const current = this.items$.value.slice();
    current.unshift(created);
    this.items$.next(current);
    return created;
  }

  async update(id: string, payload: TypeVehiculeCreate) {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };
    const updated = await firstValueFrom(this.http.put<TypeVehicule>(`${this.baseUrl}/${id}`, payload, { headers }));
    const current = this.items$.value.map(i => (i.id === id ? updated : i));
    this.items$.next(current);
    return updated;
  }

  async delete(id: string) {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };
    await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`, { headers }));
    const current = this.items$.value.filter(i => i.id !== id);
    this.items$.next(current);
  }
}
