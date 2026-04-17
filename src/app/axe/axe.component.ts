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
import { MatTooltipModule } from '@angular/material/tooltip';
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
      MatSnackBarModule,
      MatTooltipModule
    ]
})


export class AxeComponent implements OnInit {
  axes: Axe[] = [];
  displayedColumns: string[] = ['libelle', 'distance', 'tempsMoyen', 'trajet', 'actions'];

  private readonly fb = inject(FormBuilder);
  private readonly axeService = inject(AxeService);
  private readonly localiteService = inject(LocaliteService);
  private readonly snackBar = inject(MatSnackBar);

  axeForm = this.fb.group({

    libelle: [''],
    distance: [0],
    tempsMoyen: [0],
    departId: [''],
    arriveId: [''],
    description: ['']
  });

  isFormVisible = false;
  editingId: string | null = null;

  localites: Localite[] = [];
  itineraireIds: string[] = [];
  selectedIntermediaire = '';


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
    this.itineraireIds = [];
    this.selectedIntermediaire = '';
  }

  closeForm() {
    this.isFormVisible = false;
    this.editingId = null;
    this.axeForm.reset();
    this.itineraireIds = [];
    this.selectedIntermediaire = '';
  }

  onSubmit() {
    const raw = this.axeForm.value as any;
    const payload: AxeCreate = {
      libelle: raw.libelle,
      distance: Number(raw.distance ?? 0),
      tempsMoyen: Number(raw.tempsMoyen ?? 0),
      description: raw.description,
      departId: raw.departId,
      arriveId: raw.arriveId,
      itineraire: [...this.itineraireIds]
    };
    console.debug('[AxeComponent] form submitted', payload);
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
      distance: axe.distance,
      tempsMoyen: axe.tempsMoyen,
      departId: axe.depart?.id,
      arriveId: axe.arrive?.id,
      description: axe.description,
    });
    this.itineraireIds = axe.itineraire?.map(l => l.id) ?? [];
    this.selectedIntermediaire = '';
    this.isFormVisible = true;
  }

  addLocaliteIntermediaire() {
    if (this.selectedIntermediaire && !this.itineraireIds.includes(this.selectedIntermediaire)) {
      this.itineraireIds = [...this.itineraireIds, this.selectedIntermediaire];
      this.selectedIntermediaire = '';
    }
  }

  removeLocaliteIntermediaire(index: number) {
    this.itineraireIds = this.itineraireIds.filter((_, i) => i !== index);
  }

  getLocaliteLibelle(id: string): string {
    return this.localites.find(l => l.id === id)?.libelle ?? id;
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
