import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompagnieService } from '../../services/compagnie.service';
import { Compagnie, CompagnieCreate } from '../../models/compagnie.model';

@Component({
  selector: 'app-compagnie',
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
    MatTooltipModule,
  ],
  templateUrl: './compagnie.component.html',
  styleUrls: ['./compagnie.component.scss'],
})
export class CompagnieComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly compagnieService = inject(CompagnieService);
  private readonly snack = inject(MatSnackBar);

  form = this.fb.group({
    abrege: ['', [Validators.required, Validators.maxLength(50)]],
    nomCompagnie: ['', [Validators.required, Validators.maxLength(200)]],
    telephone: [''],
    email: ['', [Validators.email]],
    siege: [''],
    description: [''],
  });

  data: Compagnie[] = [];
  displayedColumns = ['abrege', 'nomCompagnie', 'telephone', 'email', 'actions'];
  editingId?: string;
  isFormVisible = false;

  ngOnInit(): void {
    this.compagnieService.load().subscribe({
      next: () => {
        this.compagnieService.getAll().subscribe(list => (this.data = list));
      },
      error: err => console.error('[CompagnieComponent] failed to load', err),
    });
  }

  select(item: Compagnie) {
    this.editingId = item.id;
    this.form.patchValue({
      abrege: item.abrege,
      nomCompagnie: item.nomCompagnie,
      telephone: item.telephone,
      email: item.email,
      siege: item.siege,
      description: item.description,
    });
    this.isFormVisible = true;
  }

  showForm() {
    this.isFormVisible = true;
    this.editingId = undefined;
    this.form.reset();
  }

  closeForm() {
    this.isFormVisible = false;
    this.resetForm();
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as CompagnieCreate;
    try {
      if (this.editingId) {
        await this.compagnieService.update(this.editingId, payload);
        this.snack.open('Compagnie mise à jour', 'OK', { duration: 2000 });
      } else {
        await this.compagnieService.create(payload);
        this.snack.open('Compagnie ajoutée', 'OK', { duration: 2000 });
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
      await this.compagnieService.delete(id);
      this.snack.open('Compagnie supprimée', 'OK', { duration: 2000 });
    } catch (e) {
      console.error(e);
      this.snack.open('Erreur suppression', 'OK', { duration: 3000 });
    }
  }

  resetForm() {
    this.editingId = undefined;
    this.isFormVisible = false;
    this.form.reset();
  }
}
