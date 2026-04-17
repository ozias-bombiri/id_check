import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VerificationComponent } from './verification/verification.component';
import { HistoriqueComponent } from './historique/historique.component';
import { AideComponent } from './aide/aide.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { VerificationResultatComponent } from './verification-resultat/verification-resultat.component';
import { authGuard } from './auth.guard';
import {RegisterComponent} from "./register/register.component";
import { UsersComponent } from './admin/users/users.component';
import { ProfilesComponent } from './admin/profiles/profiles.component';
import { RolesComponent } from './admin/roles/roles.component';
import { VehiculeComponent } from './parametre/vehicule/vehicule.component';
import { LocaliteComponent } from './parametre/localite/localite.component';
import { CompagnieComponent } from './parametre/compagnie/compagnie.component';
import { TypesVehiculesComponent } from './parametre/types-vehicules/types-vehicules.component';
import { LogoutComponent } from './logout/logout.component';
import { AxeComponent } from './axe/axe.component';
import { TrajetComponent } from './trajet/trajet.component';
import { PassagerComponent } from './passager/passager.component';
import { PosteControleComponent } from './poste-controle/poste-controle.component';
import { TrajetCheckerComponent } from './trajet-checker/trajet-checker.component';
import { AxeCheckerComponent } from './axe-checker/axe-checker.component';
import { TrajetCompagnieComponent } from './trajet-compagnie/trajet-compagnie.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
  { path: 'verifier', component: VerificationComponent, canActivate: [authGuard] },
  { path: 'historique', component: HistoriqueComponent, canActivate: [authGuard] },
  { path: 'aide', component: AideComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/utilisateurs', component: UsersComponent, canActivate: [authGuard] },
  { path: 'admin/profiles', component: ProfilesComponent, canActivate: [authGuard] },
  { path: 'admin/roles', component: RolesComponent, canActivate: [authGuard] },
  { path: 'compagnie/vehicules', component: VehiculeComponent, canActivate: [authGuard] },
  { path: 'param/localites', component: LocaliteComponent, canActivate: [authGuard] },
  { path: 'param/compagnies', component: CompagnieComponent, canActivate: [authGuard] },
  { path: 'param/types-vehicules', component: TypesVehiculesComponent, canActivate: [authGuard] },
  {path: 'logout', component: LogoutComponent, canActivate: [authGuard] },
  {path: 'axes', component: AxeComponent, canActivate: [authGuard] },
  {path: 'checker/axes', component: AxeCheckerComponent, canActivate: [authGuard] },
  {path: 'trajets', component: TrajetComponent, canActivate: [authGuard] },
  {path: 'checker/trajets', component: TrajetCheckerComponent, canActivate: [authGuard] },
  {path: 'compagnie/trajets', component: TrajetCompagnieComponent, canActivate: [authGuard] },
  {path: 'passagers', component: PassagerComponent, canActivate: [authGuard] },
  {path: 'postes', component: PosteControleComponent, canActivate: [authGuard] },
];
