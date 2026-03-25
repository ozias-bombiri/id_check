import { Component } from '@angular/core';
import { Personne } from '../models/Personne';
import { PersonneCardComponent } from '../personne-card/personne-card.component';

@Component({
  selector: 'app-verification-resultat',
  standalone: true,
  imports: [PersonneCardComponent],
  templateUrl: './verification-resultat.component.html',
  styleUrls: ['./verification-resultat.component.scss']
})
export class VerificationResultatComponent {

  personne: Personne = {
      id: 1,
      numero: '12345',
      email: 'test@email.com',
      role: 'Utilisateur',
      nom: 'Doe',
      prenom: 'John',
      dateNaissance: new Date('1995-06-15'),
      lieuNaissance: 'Paris',
      sexe: 'M',
      taille: 180,
      profession: 'Développeur',
      photo: ''
  };

}
