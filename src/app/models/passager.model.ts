import { Axe } from './axe.model';
import { Localite } from './localite.model';
import { Personne, PersonneCreate } from './Personne';
import { Trajet } from './trajet.model';
import { Vehicule } from './vehicule.model';

export interface Passager {
  id?: string; // UUID

  depart?: Localite;
  destination: Localite;
  trajet:Trajet;
  personne:Personne;
}

export interface PassagerCreate {
  departId: string;
  destinationId: string;
  trajetId:string;
  numero: string;
  sharedCode?: string;
  personne: PersonneCreate;
}
