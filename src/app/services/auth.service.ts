import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

interface AuthResponse {
  type: string;
  token: string;
  user_id: string;
}

interface UserResponse {
  id: number;
  nom: string;
  prenom: string;
  structure: string;
  profile: any;

}



@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry';
  private readonly TOKEN_EXPIRY_TIME = 3600000;
  private readonly USER_PROFILE_KEY = 'user_profile';

  private readonly AUTH_URL = 'http://localhost:8089/api/auth/login';
  private readonly REGISTER_URL = 'http://localhost:8089/api/auth/register';
  private readonly USER_URL = 'http://localhost:8089/api/users';



  // 🔥 AJOUT ICI
  private userProfileSubject = new BehaviorSubject<any>(this.getStoredProfile());
  userProfile$ = this.userProfileSubject.asObservable();

  private isAuthSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔥 helper
  private getStoredProfile(): any {
    const profile = localStorage.getItem(this.USER_PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
  const body = { email, password };
  const res = await lastValueFrom(
    this.http.post<AuthResponse>(this.AUTH_URL, body)
  );

  if (res?.token) {
    // 1. stocker token
    localStorage.setItem(this.TOKEN_KEY, res.token);

    const expiryTime = Date.now() + this.TOKEN_EXPIRY_TIME;
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());

    // 2. récupérer user COMPLET
    const userInfos = await this.getUser(res.user_id);
    console.log('User infos retrieved after login :', userInfos);
    if (userInfos?.id) {
      // 3. stocker profil
      localStorage.setItem(
        this.USER_PROFILE_KEY,
        JSON.stringify(userInfos.profile.libelle)
      );

      // 4. notifier
      this.userProfileSubject.next(userInfos.profile.libelle);
      this.isAuthSubject.next(true);

      console.log('Login successful, profile:', userInfos.profile.libelle);
    }
  }

  return res;
}

  async getUser(userId: string): Promise<UserResponse> {
  const token = this.getToken();
  if (!token) throw new Error('User not authenticated');

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const res = await lastValueFrom(
    this.http.get<UserResponse>(`${this.USER_URL}/${userId}`, { headers })
  );

  return res;
}

  async register(email: string, password: string): Promise<AuthResponse> {
  const body = { email, password };
  const res = await lastValueFrom(
    this.http.post<AuthResponse>(this.REGISTER_URL, body)
  );

  if (res?.token) {
    localStorage.setItem(this.TOKEN_KEY, res.token);

    const expiryTime = Date.now() + this.TOKEN_EXPIRY_TIME;
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());

    // 🔥 récupérer user après inscription
    const userInfos = await this.getUser(res.user_id);

    if (userInfos?.id) {
      localStorage.setItem(
        this.USER_PROFILE_KEY,
        JSON.stringify(userInfos.profile)
      );

      this.userProfileSubject.next(userInfos.profile);
      this.isAuthSubject.next(true);
    }
  }

  return res;
}

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(this.USER_PROFILE_KEY);

    // 🔥 notifier
    this.userProfileSubject.next(null);
    this.isAuthSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getProfile(): any {
    return this.getStoredProfile();
  }

  isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;
    return Date.now() > parseInt(expiryTime, 10);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }


}
