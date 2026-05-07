
import { PosteControle, PosteControleCreate } from '../models/postes.model';
import { PosteControleService } from '../services/poste.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AxeService } from '../services/axe.service';
import { Axe } from '../models/axe.model';



@Component({
  selector: 'app-poste-controle',
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
  ],
  templateUrl: './poste-controle.component.html',
  styleUrl: './poste-controle.component.scss'
})
export class PosteControleComponent {
  postes: PosteControle[] = [];
    displayedColumns: string[] = ['libelle', 'axes', 'description', 'actions'];

    private readonly fb = inject(FormBuilder);
    private readonly posteService = inject(PosteControleService);
    private readonly axeService = inject(AxeService);
    private readonly snackBar = inject(MatSnackBar);

    axeForm = this.fb.group({

      libelle: [''],
      axeIds: this.fb.array([this.createDepart()]),
      etatPoste: true,
      description: ['']
    });

    isFormVisible = false;
    editingId: string | null = null;

    axes: Axe[] = [];


    ngOnInit() {
      // subscribe to live list updates
      this.posteService.getAll().subscribe((postes: PosteControle[]) => {
        this.postes = postes;
        console.debug('[AxeComponent] axes updated', postes);
      });

      // load reference data
      this.axeService.load().subscribe({ next: () => this.axeService.getAll().subscribe(list => (this.axes = list)), error: err => console.error('[AxeComponent] failed to load axes', err) });

      // trigger vehicles load and report errors
      this.posteService.load().subscribe({ next: () => console.debug('[AxeComponent] axeService.load() succeeded'), error: err => console.error('[AxeComponent] failed to load axes', err) });
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
      const payload: PosteControleCreate = {
        libelle: raw.libelle,
        description: raw.description,
        etatPoste: true,
        axes: raw.axeIds
      };
      console.debug('[AxeComponent] form submitted', payload);
      (async () => {
        try {
          if (this.editingId) {
            await this.posteService.update(this.editingId, payload);
            this.snackBar.open('Poste mis à jour', 'OK', { duration: 2000 });
          } else {
            await this.posteService.create(payload);
            this.snackBar.open('Poste ajouté', 'OK', { duration: 2000 });
          }
          this.closeForm();
        } catch (e) {
          console.error(e);
          this.snackBar.open('Erreur serveur', 'OK', { duration: 3000 });
        }
      })();
    }

    editVehicule(poste: PosteControle) {
      this.editingId = poste.id || null;
      this.axeForm.patchValue({
        libelle: poste.libelle,
        //axeIds: poste.axes? ,
        etatPoste: poste.etatPoste,
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
            this.snackBar.open('poste supprimé', 'OK', { duration: 2000 });
          } catch (e) {
            console.error(e);
            this.snackBar.open('Erreur suppression', 'OK', { duration: 3000 });
          }
        })();
      }
    }



// Getter pratique
get axesIds(): FormArray {
  return this.axeForm.get('axeIds') as FormArray;
}

// Créer un champ départ
createDepart() {
  return this.fb.control(null, Validators.required);
}

// Ajouter
addDepart() {
  this.axesIds.push(this.createDepart());
}

// Supprimer
removeDepart(index: number) {
  this.axesIds.removeAt(index);
}

  }

