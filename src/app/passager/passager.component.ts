
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
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
import { CheckRequest, CheckResponse } from '../models/verification.model';


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
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatSnackBarModule
    ]
})



export class PassagerComponent implements OnInit {
  today: string = new Date().toISOString().substring(0, 10);
  trajets: Trajet[] = [];

  filteredTrajets: Trajet[] = [];
  filterDate: string | null = null;
  displayedColumns: string[] = ['dateDepart', 'heureDepart', 'axe', 'vehicule', 'actions'];
  personne: PersonneCreate | null = null;
  identityMode: 'none' | 'sharedCode' | 'manualIdentity' = 'none';
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

    departId: ['', [Validators.required]],
    dateDepart: [{ value: '', disabled: true }],
    heureDepart: [{ value: '', disabled: true }],
    axe: [{ value: '', disabled: true }],
    destinationId: ['', [Validators.required]],
    trajetId: ['', [Validators.required]],
    numero: ['', [Validators.required]],
    sharedCode: [''],
    nom: [''],
    prenom: [''],
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
    this.applyFilter();
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
    this.identityMode = 'none';
    this.passagerForm.reset();
  }

  closeForm() {
    this.isFormVisible = false;
    this.editingId = null;
    this.identityMode = 'none';
    this.passagerForm.reset();
  }

  onSubmit() {
    const raw = this.passagerForm .value as any;
    const departId = (raw.departId || '').trim();
    const destinationId = (raw.destinationId || '').trim();
    const trajetId = (raw.trajetId || '').trim();
    const numero = (raw.numero || '').trim();

    if (!departId || !destinationId || !trajetId || !numero) {
      this.snackBar.open('Renseignez depart, destination et numero.', 'OK', { duration: 3000 });
      return;
    }

    if (this.identityMode === 'none') {
      this.snackBar.open('Choisissez un mode d\'identité.', 'OK', { duration: 3000 });
      return;
    }

    const sharedCode = this.identityMode === 'sharedCode' ? (raw.sharedCode || '').trim() : '';
    const nom = this.identityMode === 'manualIdentity' ? (raw.nom || '').trim() : '';
    const prenom = this.identityMode === 'manualIdentity' ? (raw.prenom || '').trim() : '';

    if (this.identityMode === 'sharedCode' && !sharedCode) {
      this.snackBar.open('Saisissez le code partagé.', 'OK', { duration: 3000 });
      return;
    }

    if (this.identityMode === 'manualIdentity' && (!nom || !prenom)) {
      this.snackBar.open('Saisissez nom et prénom.', 'OK', { duration: 3000 });
      return;
    }

    const personne: PersonneCreate = {
      nom,
      prenom,
      numero,
      id: raw.id
    }
    const payload: PassagerCreate = {
      departId,
      destinationId,
      trajetId,
      numero,
      sharedCode,
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

    const axeId = trajet.axe?.id;
    if (axeId) {
      this.localiteService.loadByAxe(axeId).subscribe({
        next: (localites) => {
          this.localites = localites ?? [];
          this.passagerForm.patchValue({
            departId: this.localites[0]?.id ?? '',
            destinationId: this.localites[this.localites.length - 1]?.id ?? ''
          });
        },
        error: (err) => {
          console.error('[PassagerComponent] failed to load localites by axe', err);
          this.snackBar.open('Erreur chargement localites par axe', 'OK', { duration: 3000 });
        }
      });
    }

    this.isFormVisible = true;
  }

  listePassager(trajet: Trajet) {
    const trajetId = trajet?.id;
    if (!trajetId) return;


      (async () => {
        try {
          const passagers = await this.passagerService.loadTrajet(String(trajetId));
          //this.snackBar.open('Trajet supprimé', 'OK', { duration: 2000 });
          console.debug('Passagers du trajet', passagers);
          // 🔥 ouvrir modal
          this.dialog.open(PassagerModalComponent, {
            width: '960px',
            maxWidth: '95vw',
            data: { passagers, trajet }
          });
        } catch (e) {
          console.error(e);
          this.snackBar.open('Erreur recupération de la liste', 'OK', { duration: 3000 });
        }
      })();

  }

  checkNumero(){
    const checkRequest: CheckRequest = {
      identifiant: this.passagerForm.value.numero || '',
      nom: this.passagerForm.value.nom || '',
      prenom: this.passagerForm.value.prenom || '',
    }
    console.debug('Checking numero with request:', checkRequest);

    (async () => {
      try {
          const resp: CheckResponse | null = await this.verificationService.checkIdentifiant(checkRequest);
          console.debug('Verification response:', resp);
          if(!resp  || !resp.checkResult ){
            this.snackBar.open('Personne non trouvée ', 'OK', { duration: 3000 });
            //this.passagerForm.get('nom')?.setValue('');
            //this.passagerForm.get('prenom')?.setValue('');
            //this.passagerForm.get('nom')?.enable();
            //this.passagerForm.get('prenom')?.enable();
          }
          else {
            this.personne = {
              nom: resp.libelleResult ? resp.libelleResult.split(' ')[0] : '',
              prenom: resp.libelleResult ? resp.libelleResult.split(' ')[1] : '',
              numero: this.passagerForm.value.numero || ''
            }

          }
          //this.snackBar.open('Passager mis à jour', 'OK', { duration: 2000 });

      } catch (e) {
        console.error(e);
        this.snackBar.open('Erreur serveur', 'OK', { duration: 3000 });
      }
    })();

  }

   onFilterDate(event: any) {
    this.filterDate = event.target.value;
    this.applyFilter();
  }

  applyFilter() {
    if (!this.filterDate) {
      this.filteredTrajets = this.trajets;
      return;
    }

    this.filteredTrajets = this.trajets.filter(t => {
      const d = new Date(t.dateDepart).toISOString().substring(0, 10);
      return d === this.filterDate;
    });
  }

  isPast(trajet: Trajet): boolean {
    const today = new Date();
    const trajetDate = new Date(trajet.dateDepart);
    const heureDepart = trajet.heureDepart ? trajet.heureDepart.split(':') : null;
    if(heureDepart && heureDepart.length === 2){
      trajetDate.setHours(Number(heureDepart[0]), Number(heureDepart[1]), 0, 0);
    }
    // on enlève l'heure
    //today.setHours(0,0,0,0);
    //trajetDate.setHours(0,0,0,0);

    return trajetDate < today ;
  }
}


