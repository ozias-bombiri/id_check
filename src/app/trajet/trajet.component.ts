
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
import { Trajet, TrajetCreate } from '../models/trajet.model';
import { TrajetService } from '../services/trajet.service';
import { Vehicule } from '../models/vehicule.model';
import { VehiculeService } from '../services/vehicule.service';


@Component({
  selector: 'app-trajet',
  standalone: true,
  templateUrl: './trajet.component.html',
  styleUrl: './trajet.component.scss',
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


export class TrajetComponent implements OnInit {
  trajets: Trajet[] = [];
  displayedColumns: string[] = ['dateDepart', 'heureDepart', 'axe', 'vehicule', 'actions'];

  private readonly fb = inject(FormBuilder);
  private readonly trajetService = inject(TrajetService);
  private readonly axeService = inject(AxeService);
  private readonly localiteService = inject(LocaliteService);
  private readonly vehiculeService = inject(VehiculeService);
  private readonly snackBar = inject(MatSnackBar);

  trajetForm = this.fb.group({

    dateDepart: [''],
    heureDepart: [''],
    axeId: [''],
    vehiculeId: ['']
  });

  isFormVisible = false;
  editingId: string | null = null;

  localites: Localite[] = [];
  axes: Axe[] = [];
  vehicules: Vehicule[] = [];

  ngOnInit() {
    // subscribe to live list updates
    this.trajetService.getAll().subscribe((trajets: Trajet[]) => {
      this.trajets = trajets;
      console.debug('[TrajetComponent] trajets updated', trajets);
    });

    // load reference data
    this.localiteService.load().subscribe({ next: () => this.localiteService.getAll().subscribe(list => (this.localites = list)), error: err => console.error('[TrajetComponent] failed to load localites', err) });

    // trigger vehicles load and report errors
    this.axeService.load().subscribe({ next: () => this.axeService.getAll().subscribe(list => (this.axes = list)), error: err => console.error('[TrajetComponent] failed to load axes', err) });
    this.vehiculeService.load().subscribe({ next: () => this.vehiculeService.getAll().subscribe(list => (this.vehicules = list)), error: err => console.error('[TrajetComponent] failed to load vehicules', err) });
    this.trajetService.load().subscribe({ next: () => console.debug('[TrajetComponent] trajetService.load() succeeded'), error: err => console.error('[TrajetComponent] failed to load trajets', err) });

  }
  showForm() {
    this.isFormVisible = true;
    this.editingId = null;
    this.trajetForm.reset();
  }

  closeForm() {
    this.isFormVisible = false;
    this.editingId = null;
    this.trajetForm.reset();
  }

  onSubmit() {
    const raw = this.trajetForm.value as any;
    const payload: TrajetCreate = {
      dateDepart: new Date(raw.dateDepart),
      heureDepart: raw.heureDepart,
      axeId: raw.axeId,
      vehiculeId: raw.vehiculeId
    };
    console.debug('[TrajetComponent] form submitted', payload);

    (async () => {
      try {
        if (this.editingId) {
          await this.trajetService.update(this.editingId, payload);
          this.snackBar.open('Trajet mis à jour', 'OK', { duration: 2000 });
        } else {
          await this.trajetService.create(payload);
          this.snackBar.open('Trajet ajouté', 'OK', { duration: 2000 });
        }
        this.closeForm();
      } catch (e) {
        console.error(e);
        this.snackBar.open('Erreur serveur', 'OK', { duration: 3000 });
      }
    })();
  }

  editVehicule(trajet: Trajet) {
    this.editingId = trajet.id || null;
    this.trajetForm.patchValue({
      dateDepart: trajet.dateDepart ? new Date(trajet.dateDepart).toISOString().substring(0, 10) : '',
      heureDepart: trajet.heureDepart,
      axeId: trajet.axe?.id,
      vehiculeId: trajet.vehicule?.id,
    });
    this.isFormVisible = true;
  }

  deleteVehicule(id: string | number | undefined) {
    if (!id) return;

    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?');
    if (confirmation) {
      (async () => {
        try {
          await this.trajetService.delete(String(id));
          this.snackBar.open('Trajet supprimé', 'OK', { duration: 2000 });
        } catch (e) {
          console.error(e);
          this.snackBar.open('Erreur suppression', 'OK', { duration: 3000 });
        }
      })();
    }
  }

}

