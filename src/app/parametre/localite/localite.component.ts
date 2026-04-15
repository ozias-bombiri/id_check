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
import { LocaliteService } from '../../services/localite.service';
import { Localite, LocaliteCreate } from '../../models/localite.model';


@Component({
  selector: 'app-localite',
  standalone: true,
  templateUrl: './localite.component.html',
  styleUrls: ['./localite.component.scss'],
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


export class LocaliteComponent implements OnInit {
  displayedColumns: string[] = ['libelle', 'typeLocalite', 'actions'];

  private readonly fb = inject(FormBuilder);
  private readonly localiteService = inject(LocaliteService);
  private readonly snackBar = inject(MatSnackBar);

  localiteForm = this.fb.group({

    libelle: [''],
    typeLocalite: [''],
    description: ['']
  });

  isFormVisible = false;
  editingId: string | null = null;

  localites: Localite[] = [];


  ngOnInit() {
    // subscribe to live list updates
    this.localiteService.getAll().subscribe((localites: Localite[]) => {
      this.localites = localites;
      console.debug('[AxeComponent] axes updated', localites);
    });


    // trigger vehicles load and report errors
    this.localiteService.load().subscribe({ next: () => this.localiteService.getAll().subscribe(list => (this.localites = list)), error: err => console.error('[AxeComponent] failed to load localites', err) });
  }
  showForm() {
    this.isFormVisible = true;
    this.editingId = null;
    this.localiteForm.reset();
  }

  closeForm() {
    this.isFormVisible = false;
    this.editingId = null;
    this.localiteForm.reset();
  }

  onSubmit() {
    const raw = this.localiteForm.value as any;
    const payload: LocaliteCreate = {
      libelle: raw.libelle,
      description: raw.description,
      typeLocalite: raw.typeLocalite
    };
    console.debug('[AxeComponent] form submitted', payload);
    (async () => {
      try {
        if (this.editingId) {
          await this.localiteService.update(this.editingId, payload);
          this.snackBar.open('Axe mis à jour', 'OK', { duration: 2000 });
        } else {
          await this.localiteService.create(payload);
          this.snackBar.open('Axe ajouté', 'OK', { duration: 2000 });
        }
        this.closeForm();
      } catch (e) {
        console.error(e);
        this.snackBar.open('Erreur serveur', 'OK', { duration: 3000 });
      }
    })();
  }

  editVehicule(localite: Localite) {
    this.editingId = localite.id || null;
    this.localiteForm.patchValue({
      libelle: localite.libelle,
      typeLocalite: localite.typeLocalite,
      description: localite.description,
    });
    this.isFormVisible = true;
  }

  deleteVehicule(id: string | number | undefined) {
    if (!id) return;

    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?');
    if (confirmation) {
      (async () => {
        try {
          await this.localiteService.delete(String(id));
          this.snackBar.open('Axe supprimé', 'OK', { duration: 2000 });
        } catch (e) {
          console.error(e);
          this.snackBar.open('Erreur suppression', 'OK', { duration: 3000 });
        }
      })();
    }
  }

}


























