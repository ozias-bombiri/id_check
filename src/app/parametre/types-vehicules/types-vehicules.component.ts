import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TypeVehiculeService } from '../../../app/services/type-vehicule.service';
import { TypeVehicule, TypeVehiculeCreate } from '../../../app/models/type-vehicule.model';

@Component({
  selector: 'app-types-vehicules',
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
  ],
  templateUrl: './types-vehicules.component.html',
  styleUrls: ['./types-vehicules.component.scss'],
})
export class TypesVehiculesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(TypeVehiculeService);
  private readonly snack = inject(MatSnackBar);

  form = this.fb.group({
    libelle: ['', [Validators.required, Validators.maxLength(120)]],
    description: [''],
  });

  data: TypeVehicule[] = [];
  displayedColumns = ['libelle', 'description', 'actions'];
  editingId?: string;

  ngOnInit(): void {
    this.service.load().subscribe({
      next: () => {
        this.service.getAll().subscribe(list => (this.data = list));
      },
      error: err => console.error('[TypesVehiculesComponent] failed to load', err),
    });
  }

  select(item: TypeVehicule) {
    this.editingId = item.id;
    this.form.patchValue({ libelle: item.libelle, description: item.description });
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value as TypeVehiculeCreate;
    try {
      if (this.editingId) {
        await this.service.update(this.editingId, payload);
        this.snack.open('Type de véhicule mis à jour', 'OK', { duration: 2000 });
      } else {
        await this.service.create(payload);
        this.snack.open('Type de véhicule ajouté', 'OK', { duration: 2000 });
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
      await this.service.delete(id);
      this.snack.open('Type de véhicule supprimé', 'OK', { duration: 2000 });
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
