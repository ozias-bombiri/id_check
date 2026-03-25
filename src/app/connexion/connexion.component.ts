import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  loading = false;
  error?: string;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  async submit() {
    this.error = undefined;
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    this.loading = true;
    try {
      const res = await this.auth.login(email!, password!);
      this.loading = false;
      //console.log('Login successful', res);
      this.router.navigate(['/']);
    } catch (err: any) {
      this.loading = false;
      console.error('Login error', err);
      let msg = 'Erreur lors de la connexion';
      if (err?.status === 0) {
        msg = 'Erreur réseau (le backend est injoignable)';
      } else if (err?.status === 401) {
        if (err?.error) {
          if (typeof err.error === 'string') {
            msg = err.error;
          } else if (err.error?.message) {
            msg = err.error.message;
          } else {
            msg = 'Identifiants incorrects (401)';
          }
        } else {
          msg = 'Identifiants incorrects (401)';
        }
      } else if (err?.error) {
        try {
          msg = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
        } catch (e) {
          msg = err.message || String(err);
        }
      } else {
        msg = err?.message || String(err);
      }

      this.error = msg;
    }
  }
}
