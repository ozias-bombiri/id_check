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
import { VehiculeService } from '../../services/vehicule.service';
import { CompagnieService } from '../../services/compagnie.service';
import { TypeVehiculeService } from '../../services/type-vehicule.service';
import { Vehicule, VehiculeCreate } from '../../models/vehicule.model';
import { Compagnie } from '../../models/compagnie.model';
import { TypeVehicule } from '../../models/type-vehicule.model';

@Component({
  selector: 'app-vehicule',
  templateUrl: './vehicule.component.html',
  styleUrl: './vehicule.component.scss',
  standalone: true,
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
export class VehiculeComponent implements OnInit {
  vehicules: Vehicule[] = [];
  displayedColumns: string[] = ['immatriculation', 'etatVehicule', 'nombreDePlace', 'compagnie', 'typeVehicule', 'actions'];

  private readonly fb = inject(FormBuilder);
  private readonly vehiculeService = inject(VehiculeService);
  private readonly compagnieService = inject(CompagnieService);
  private readonly typeService = inject(TypeVehiculeService);
  private readonly snackBar = inject(MatSnackBar);

  vehiculeForm = this.fb.group({
    immatriculation: [''],
    etatVehicule: [''],
    nombreDePlace: [1],
    compagnieId: [''],
    typeVehiculeId: ['']
  });

  isFormVisible = false;
  editingId: string | null = null;

  compagnies: Compagnie[] = [];
  types: TypeVehicule[] = [];

  ngOnInit() {
    // subscribe to live list updates
    this.vehiculeService.getAll().subscribe((vehicules: Vehicule[]) => {
      this.vehicules = vehicules;
      console.debug('[VehiculeComponent] vehicules updated', vehicules);
    });

    // load reference data
    this.compagnieService.load().subscribe({ next: () => this.compagnieService.getAll().subscribe(list => (this.compagnies = list)), error: err => console.error('[VehiculeComponent] failed to load compagnies', err) });
    this.typeService.load().subscribe({ next: () => this.typeService.getAll().subscribe(list => (this.types = list)), error: err => console.error('[VehiculeComponent] failed to load types', err) });

    // trigger vehicles load and report errors
    this.vehiculeService.load().subscribe({ next: () => console.debug('[VehiculeComponent] vehiculeService.load() succeeded'), error: err => console.error('[VehiculeComponent] failed to load vehicules', err) });
  }
  showForm() {
    this.isFormVisible = true;
    this.editingId = null;
    this.vehiculeForm.reset({ nombreDePlace: 1 });
  }

  closeForm() {
    this.isFormVisible = false;
    this.editingId = null;
    this.vehiculeForm.reset({ nombreDePlace: 1 });
  }

  onSubmit() {
    const raw = this.vehiculeForm.value as any;
    const payload: VehiculeCreate = {
      immatriculation: raw.immatriculation,
      etatVehicule: raw.etatVehicule,
      nombreDePlace: Number(raw.nombreDePlace) || 0,
      compagnieId: raw.compagnieId,
      typeVehiculeId: raw.typeVehiculeId,
    };

    (async () => {
      try {
        if (this.editingId) {
          await this.vehiculeService.update(this.editingId, payload);
          this.snackBar.open('Véhicule mis à jour', 'OK', { duration: 2000 });
        } else {
          await this.vehiculeService.create(payload);
          this.snackBar.open('Véhicule ajouté', 'OK', { duration: 2000 });
        }
        this.closeForm();
      } catch (e) {
        console.error(e);
        this.snackBar.open('Erreur serveur', 'OK', { duration: 3000 });
      }
    })();
  }

  editVehicule(vehicule: Vehicule) {
    this.editingId = vehicule.id || null;
    this.vehiculeForm.patchValue({
      immatriculation: vehicule.immatriculation,
      etatVehicule: vehicule.etatVehicule,
      nombreDePlace: vehicule.nombreDePlace,
      compagnieId: vehicule.compagnie?.id,
      typeVehiculeId: vehicule.typeVehicule?.id,
    });
    this.isFormVisible = true;
  }

  deleteVehicule(id: string | number | undefined) {
    if (!id) return;

    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?');
    if (confirmation) {
      (async () => {
        try {
          await this.vehiculeService.delete(String(id));
          this.snackBar.open('Véhicule supprimé', 'OK', { duration: 2000 });
        } catch (e) {
          console.error(e);
          this.snackBar.open('Erreur suppression', 'OK', { duration: 3000 });
        }
      })();
    }
  }

}
