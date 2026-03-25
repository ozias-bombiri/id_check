import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LocaliteService } from '../../services/localite.service';
import { Localite, LocaliteCreate } from '../../models/localite.model';

@Component({
  selector: 'app-localite',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  templateUrl: './localite.component.html',
  styleUrls: ['./localite.component.scss'],
})
export class LocaliteComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly localiteService = inject(LocaliteService);
  private readonly snack = inject(MatSnackBar);

  form = this.fb.group({
    libelle: ['', [Validators.required, Validators.maxLength(120)]],
    typeLocalite: ['', [Validators.required]],
    description: [''],
  });

  data: Localite[] = [];
  displayedColumns = ['libelle', 'typeLocalite', 'description', 'actions'];
  editingId?: string;

  ngOnInit(): void {
    this.localiteService.load().subscribe({
      next: () => {
        this.localiteService.getAll().subscribe(list => (this.data = list));
      },
      error: err => console.error('[LocaliteComponent] failed to load', err),
    });
  }

  select(item: Localite) {
    this.editingId = item.id;
    this.form.patchValue({ libelle: item.libelle, description: item.description });
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as LocaliteCreate;
    try {
      if (this.editingId) {
        await this.localiteService.update(this.editingId, payload);
        this.snack.open('Localité mise à jour', 'OK', { duration: 2000 });
      } else {
        await this.localiteService.create(payload);
        this.snack.open('Localité ajoutée', 'OK', { duration: 2000 });
      }
      this.resetForm();
    } catch (e) {
      console.error(e);
      this.snack.open('Erreur serveur', 'OK', { duration: 3000 });
    }
  }

  async remove(id?: string) {
    if (!id) return;
    if (!confirm('Confirmer la suppression ?')) return;
    try {
      await this.localiteService.delete(id);
      this.snack.open('Localité supprimée', 'OK', { duration: 2000 });
    } catch (e) {
      console.error(e);
      this.snack.open('Erreur suppression', 'OK', { duration: 3000 });
    }
  }

  resetForm() {
    this.editingId = undefined;
    this.form.reset();
  }
}
