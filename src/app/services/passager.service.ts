import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';
import { EndpointConfig } from '../config/endpoint';
import { AuthService } from './auth.service';
import { Trajet , TrajetCreate} from '../models/trajet.model';
import { Passager, PassagerCreate } from '../models/passager.model';

@Injectable({
  providedIn: 'root'
})
export class PassagerService {
  protected readonly http = inject(HttpClient);
  private readonly baseUrl = EndpointConfig.BASE_URL + '/passagers';
  private readonly auth = inject(AuthService);
  private readonly listPassagerUrl = EndpointConfig.BASE_URL + '/trajet/passagers';

  private readonly items$ = new BehaviorSubject<Passager[]>([]);

  /** Observable list */
  getAll(): Observable<Passager[]> {
    return this.items$.asObservable();
  }

  /** Load from backend */
  load() {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };
    return this.http.get<Passager[]>(this.baseUrl, { headers }).pipe(
      tap(items => this.items$.next(items ?? []))
    );
  }

  async create(payload: PassagerCreate) {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };
    const created = await firstValueFrom(this.http.post<Passager>(this.baseUrl, payload, { headers }));
    const current = this.items$.value.slice();
    current.unshift(created);
    this.items$.next(current);
    return created;
  }

  async update(id: string, payload: PassagerCreate) {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };
    const updated = await firstValueFrom(this.http.put<Passager>(`${this.baseUrl}/${id}`, payload, { headers }));
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

  loadTrajet(trajetId: string) {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };
    return firstValueFrom( this.http.get<Passager[]>(this.listPassagerUrl, { headers,
      params: {
        trajetId
      }
     }));
  }
}
