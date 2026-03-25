import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';
import { Compagnie, CompagnieCreate } from '../models/compagnie.model';
import { EndpointConfig } from '../config/endpoint';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CompagnieService {
  protected readonly http = inject(HttpClient);
  private readonly baseUrl = EndpointConfig.BASE_URL + '/compagnies';

  private readonly items$ = new BehaviorSubject<Compagnie[]>([]);
  private readonly auth = inject(AuthService);

  /** Observable of current list */
  getAll(): Observable<Compagnie[]> {
    return this.items$.asObservable();
  }

  /** Load items from backend */
  load() {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };
    return this.http.get<Compagnie[]>(this.baseUrl, { headers }).pipe(
      tap(items => this.items$.next(items ?? []))
    );
  }

  /** Create a new compagnie */
  async create(payload: CompagnieCreate) {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };

    const created = await firstValueFrom(this.http.post<Compagnie>(this.baseUrl, payload, { headers }));
    const current = this.items$.value.slice();
    current.unshift(created);
    this.items$.next(current);
    return created;
  }

  /** Update an existing compagnie */
  async update(id: string, payload: CompagnieCreate) {
    const token = this.auth.getToken();
      if (!token) throw new Error('User not authenticated');

      const headers = {
        Authorization: `Bearer ${token}`
      };

    const updated = await firstValueFrom(this.http.put<Compagnie>(`${this.baseUrl}/${id}`, payload, { headers }));
    const current = this.items$.value.map(i => (i.id === id ? updated : i));
    this.items$.next(current);
    return updated;
  }

  /** Delete a compagnie */
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
