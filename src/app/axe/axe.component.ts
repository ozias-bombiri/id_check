import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LocaliteService } from '../services/localite.service';
import { AxeService } from '../services/axe.service';
import { Axe, AxeCreate } from '../models/axe.model';
import { Localite } from '../models/localite.model';


@Component({
  selector: 'app-axe',
  standalone: true,
  templateUrl: './axe.component.html',
  styleUrl: './axe.component.scss',
  imports: [
      CommonModule,
      MatTableModule,
      MatButtonModule,
      MatIconModule,
      MatDialogModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatSnackBarModule
    ]
})


export class AxeComponent implements OnInit {
  axes: Axe[] = [];
  displayedColumns: string[] = ['libelle', 'depart', 'arrive', 'description', 'actions'];

  private readonly fb = inject(FormBuilder);
  private readonly axeService = inject(AxeService);
  private readonly localiteService = inject(LocaliteService);
  private readonly snackBar = inject(MatSnackBar);

  axeForm = this.fb.group({

    libelle: [''],
    departId: [''],
    arriveId: [''],
    description: ['']
  });

  isFormVisible = false;
  editingId: string | null = null;

  localites: Localite[] = [];


  ngOnInit() {
    // subscribe to live list updates
    this.axeService.getAll().subscribe((axes: Axe[]) => {
      this.axes = axes;
      console.debug('[AxeComponent] axes updated', axes);
    });

    // load reference data
    this.localiteService.load().subscribe({ next: () => this.localiteService.getAll().subscribe(list => (this.localites = list)), error: err => console.error('[AxeComponent] failed to load localites', err) });

    // trigger vehicles load and report errors
    this.axeService.load().subscribe({ next: () => console.debug('[AxeComponent] axeService.load() succeeded'), error: err => console.error('[AxeComponent] failed to load axes', err) });
  }
  showForm() {
    this.isFormVisible = true;
    this.editingId = null;
    this.axeForm.reset();
  }

  closeForm() {
    this.isFormVisible = false;
    this.editingId = null;
    this.axeForm.reset();
  }

  onSubmit() {
    const raw = this.axeForm.value as any;
    const payload: AxeCreate = {
      libelle: raw.libelle,
      description: raw.description,
      departId: raw.departId,
      arriveId: raw.arriveId
    };

    (async () => {
      try {
        if (this.editingId) {
          await this.axeService.update(this.editingId, payload);
          this.snackBar.open('Axe mis à jour', 'OK', { duration: 2000 });
        } else {
          await this.axeService.create(payload);
          this.snackBar.open('Axe ajouté', 'OK', { duration: 2000 });
        }
        this.closeForm();
      } catch (e) {
        console.error(e);
        this.snackBar.open('Erreur serveur', 'OK', { duration: 3000 });
      }
    })();
  }

  editVehicule(axe: Axe) {
    this.editingId = axe.id || null;
    this.axeForm.patchValue({
      libelle: axe.libelle,
      departId: axe.depart?.id,
      arriveId: axe.arrive?.id,
    });
    this.isFormVisible = true;
  }

  deleteVehicule(id: string | number | undefined) {
    if (!id) return;

    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?');
    if (confirmation) {
      (async () => {
        try {
          await this.axeService.delete(String(id));
          this.snackBar.open('Axe supprimé', 'OK', { duration: 2000 });
        } catch (e) {
          console.error(e);
          this.snackBar.open('Erreur suppression', 'OK', { duration: 3000 });
        }
      })();
    }
  }

}
