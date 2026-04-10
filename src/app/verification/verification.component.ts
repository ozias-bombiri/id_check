import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PersonneCardComponent } from '../personne-card/personne-card.component';
import { VerificationService, VerificationApiResponse } from '../services/verification.service';
import { Personne } from '../models/Personne';

export interface CheckRequest {

  identifiant: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  userId?: any | null;

}

export interface CheckResponse {
  checkResult: boolean;
  libelleResult?: string | null;
}

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, CommonModule, ReactiveFormsModule, PersonneCardComponent, MatProgressSpinnerModule],
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})

export class VerificationComponent {
  numero: String ="";
  headers = {
              'Content-Type': 'application/json',
              'x-api-key': 'pub_7e8ab6addbe263806611410d4b6a39cc3bdca11e844e43117abe51e7b4349b15',
              'x-reqres-env': 'prod'
            };
  project_id= '908';



  codeSent?: boolean;

  results?: string;
  loading = false;
  isSucces = false;
  errorMessage?: string;
  successMessage?: string;





  verifyForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder, private verificationService: VerificationService){
        this.verifyForm = this.fb.group({
          numero: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
          nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
          prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
          dateNaissance: ['', [Validators.required]],
        });

    }

    async onSubmit(){
      this.errorMessage = undefined;
      if(this.verifyForm.valid){

        const requestPayload: CheckRequest = {
          identifiant: this.verifyForm.value.numero,
          nom: this.verifyForm.value.nom,
          prenom: this.verifyForm.value.prenom,
          dateNaissance: this.verifyForm.value.dateNaissance,
        };
        this.loading = true;
        const resp: CheckResponse | null = await this.verificationService.checkIdentifiant(requestPayload);
        this.loading = false;
        console.log('Verification response:', resp);
        if(!resp){
          this.errorMessage = 'Erreur lors de la vérification. Veuillez réessayer.';
          return;
        }

        // If API indicates a successful id check and provides a personne, show the card
        const isFound = resp.checkResult
        if(isFound ){
          this.isSucces = true;
          this.successMessage = "Personne trouvée : " + (resp.libelleResult ?? 'Libellé non disponible');
        } else {
          this.isSucces = false;
          this.errorMessage = 'Aucune personne trouvée pour ce numéro.';
        }
      } else {
        this.errorMessage = 'Saisie invalide. Veuillez vérifier les champs et réessayer.';
      }
    }



}
