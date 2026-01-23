import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VerificationComponent } from './verification/verification.component';
import { HistoriqueComponent } from './historique/historique.component';
import { AideComponent } from './aide/aide.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { VerificationResultatComponent } from './verification-resultat/verification-resultat.component';
import { authGuard } from './auth.guard';
import {RegisterComponent} from "./register/register.component";

export const routes: Routes = [
    { path: '', component: HomeComponent },
  { path: 'verifier', component: VerificationComponent, canActivate: [authGuard] },
  { path: 'historique', component: HistoriqueComponent, canActivate: [authGuard] },
  { path: 'aide', component: AideComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'register', component: RegisterComponent },
];
