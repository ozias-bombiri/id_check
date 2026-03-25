import { Injectable } from '@angular/core';
import { Personne } from '../models/Personne';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

export interface VerificationApiResponse {
  id: number | null;
  numero: string;
  description?: string | null;
  createdAt?: string | null;
  createdBy?: string | null;
  resultat: {
    idCheckResult: number;
    libelleResult?: string | null;
  } | null;
  utilisateur?: any | null;
  personne?: Personne | null;
}

@Injectable({ providedIn: 'root' })
export class VerificationService {
  private readonly VERIFY_URL = 'http://localhost:8089/api/verifier';

  constructor(private http: HttpClient, private auth: AuthService) {}

  /**
   * Call backend verifier endpoint with Authorization header.
   * Returns the API envelope or null on error.
   */
  async findByNumero(numero: string): Promise<VerificationApiResponse | null> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    const url = `${this.VERIFY_URL}?numero=${encodeURIComponent(numero)}`;
    try {
      const obs = this.http.get<VerificationApiResponse>(url, { headers });
      const resp = await lastValueFrom(obs);
      return resp ?? null;
    } catch (err) {
      console.error('VerificationService.findByNumero error', err);
      return null;
    }
  }

  /**
   * Retrieve history of verifications from backend.
   */
  async getHistory(): Promise<VerificationApiResponse[] | null> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    const url = `http://localhost:8089/api/verfications`;
    try {
      const obs = this.http.get<VerificationApiResponse[]>(url, { headers });
      const list = await lastValueFrom(obs);
      return list ?? null;
    } catch (err) {
      console.error('VerificationService.getHistory error', err);
      return null;
    }
  }
}
