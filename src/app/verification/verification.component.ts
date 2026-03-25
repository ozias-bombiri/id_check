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
  foundPerson?: Personne | null;
  errorMessage?: string;

  



  verifyForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder, private verificationService: VerificationService){
        this.verifyForm = this.fb.group({
          numero: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],          
          
        });
    
    }

    async onSubmit(){
      this.errorMessage = undefined;
      this.foundPerson = undefined;
      if(this.verifyForm.valid){
        const numero = this.verifyForm.value.numero as string;
        this.loading = true;
        const resp: VerificationApiResponse | null = await this.verificationService.findByNumero(numero);
        this.loading = false;
        console.log('Verification response:', resp);
        if(!resp){
          this.errorMessage = 'Erreur lors de la vérification. Veuillez réessayer.';
          return;
        }

        // If API indicates a successful id check and provides a personne, show the card
        const isFound = resp.resultat?.idCheckResult === 1 && !!resp.personne;
        if(isFound && resp.personne){
          this.foundPerson = resp.personne;
        } else {
          this.errorMessage = 'Aucune personne trouvée pour ce numéro.';
        }
      } else {
        this.errorMessage = 'Numéro invalide.';
      }
    }
    
    

}
