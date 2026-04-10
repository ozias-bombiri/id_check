import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';
import { EndpointConfig } from '../config/endpoint';
import { AuthService } from './auth.service';
import { Trajet , TrajetCreate} from '../models/trajet.model';

@Injectable({
  providedIn: 'root'
})
export class TrajetService {
  protected readonly http = inject(HttpClient);
  private readonly baseUrl = EndpointConfig.BASE_URL + '/trajets';
  private readonly auth = inject(AuthService);

  private readonly items$ = new BehaviorSubject<Trajet[]>([]);

  /** Observable list */
  getAll(): Observable<Trajet[]> {
    return this.items$.asObservable();
  }

  /** Load from backend */
  load() {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };
      const structureId = this.auth.getUserStructure();
    console.debug('[TrajetService] load called with structureId', structureId);
    if(structureId) {
       const url = `${this.baseUrl}?compagnieId=${encodeURIComponent(structureId ?? '')}`;
       return this.http.get<Trajet[]>(url, { headers }).pipe(
      tap(items => this.items$.next(items ?? []))
    );
    }
    return this.http.get<Trajet[]>(this.baseUrl, { headers }).pipe(
      tap(items => this.items$.next(items ?? []))
    );
  }

  async create(payload: TrajetCreate) {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };
    const created = await firstValueFrom(this.http.post<Trajet>(this.baseUrl, payload, { headers }));
    const current = this.items$.value.slice();
    current.unshift(created);
    this.items$.next(current);
    return created;
  }

  async update(id: string, payload: TrajetCreate) {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };
    const updated = await firstValueFrom(this.http.put<Trajet>(`${this.baseUrl}/${id}`, payload, { headers }));
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
