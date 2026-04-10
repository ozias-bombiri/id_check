
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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
import { PassagerCreate } from '../models/passager.model';
import { PassagerService } from '../services/passager.service';
import { VerificationService, VerificationApiResponse } from '../services/verification.service';
import { Personne, PersonneCreate } from '../models/Personne';
import { PassagerModalComponent } from '../passager-modal/passager-modal.component';


@Component({
  selector: 'app-passager',
  standalone: true,
  templateUrl: './passager.component.html',
  styleUrl: './passager.component.scss',
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

export class PassagerComponent implements OnInit {
  trajets: Trajet[] = [];
  displayedColumns: string[] = ['dateDepart', 'heureDepart', 'axe', 'vehicule', 'actions'];

  private readonly fb = inject(FormBuilder);
  private readonly trajetService = inject(TrajetService);
  private readonly axeService = inject(AxeService);
  private readonly localiteService = inject(LocaliteService);
  private readonly vehiculeService = inject(VehiculeService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly passagerService = inject(PassagerService);
  private readonly verificationService = inject(VerificationService);
  private dialog: MatDialog = inject(MatDialog);
  passagerForm = this.fb.group({

    departId: [''],
    dateDepart: [{ value: '', disabled: true }],
    heureDepart: [{ value: '', disabled: true }],
    axe: [{ value: '', disabled: true }],
    destinationId: [''],
    trajetId: ['', [Validators.required]],
    numero: [''],
    nom: [{ value: '', disabled: true }],
    prenom: [{ value: '', disabled: true }],
    personneId: ['']

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
    this.passagerForm.reset();
  }

  closeForm() {
    this.isFormVisible = false;
    this.editingId = null;
    this.passagerForm.reset();
  }

  onSubmit() {
    const raw = this.passagerForm .value as any;
    const personne: PersonneCreate = {
      nom: raw.nom,
      prenom: raw.prenom,
      numero: raw.numero,
      id: raw.id
    }
    const payload: PassagerCreate = {
      departId: raw.departId,
      destinationId: raw.destinationId,
      trajetId: raw.trajetId,
      personne: personne,

    };
    console.debug('Submitting passager form with payload', payload);
    (async () => {
      try {
          await this.passagerService.create(payload);
          this.snackBar.open('Passager ajouté', 'OK', { duration: 2000 });

        this.closeForm();
      } catch (e) {
        console.error(e);
        this.snackBar.open('Erreur serveur', 'OK', { duration: 3000 });
      }
    })();
  }

  addPassager(trajet: Trajet) {
    console.debug('Adding passager for trajet', trajet);
    this.editingId = trajet.id || null;
    this.passagerForm.patchValue({
      dateDepart: trajet.dateDepart ? new Date(trajet.dateDepart).toISOString().substring(0, 10) : '',
      trajetId: trajet.id,
      heureDepart: trajet.heureDepart ? trajet.heureDepart : '',
      axe: trajet.axe ? trajet.axe.libelle : ''
    });
    this.isFormVisible = true;
  }

  listePassager(trajetId: string |  undefined) {
    if (!trajetId) return;


      (async () => {
        try {
          const passagers = await this.passagerService.loadTrajet(String(trajetId));
          //this.snackBar.open('Trajet supprimé', 'OK', { duration: 2000 });
          console.debug('Passagers du trajet', passagers);
          // 🔥 ouvrir modal
          this.dialog.open(PassagerModalComponent, {
            width: '600px',
            data: { passagers }
          });
        } catch (e) {
          console.error(e);
          this.snackBar.open('Erreur recupération de la liste', 'OK', { duration: 3000 });
        }
      })();

  }

  checkNumero(){
    const numero = this.passagerForm.value.numero as string;
    console.debug('Checking numero:', numero);

    (async () => {
      try {
          const resp: VerificationApiResponse | null = await this.verificationService.findByNumero(numero);
          console.debug('Verification response:', resp);
          if(!resp  || resp.resultat?.idCheckResult === 0 ){
            this.snackBar.open('Personne non trouvée. Veuillez renseigner manuellement.', 'OK', { duration: 3000 });
            this.passagerForm.get('nom')?.setValue('');
            this.passagerForm.get('prenom')?.setValue('');
            this.passagerForm.get('nom')?.enable();
            this.passagerForm.get('prenom')?.enable();
          }
          else {
          // If API indicates a successful id check and provides a personne, show the card
          const isFound = resp.resultat?.idCheckResult === 1 && !!resp.personne;
          if(isFound && resp.personne){
            this.passagerForm.get('nom')?.setValue(resp.personne.nom);
            this.passagerForm.get('prenom')?.setValue(resp.personne.prenom);
            this.passagerForm.get('nom')?.disable();
            this.passagerForm.get('prenom')?.disable();
            this.passagerForm.get('personneId')?.setValue(resp.personne.id);
          }
          //this.snackBar.open('Passager mis à jour', 'OK', { duration: 2000 });
        }
      } catch (e) {
        console.error(e);
        this.snackBar.open('Erreur serveur', 'OK', { duration: 3000 });
      }
    })();

  }
}


