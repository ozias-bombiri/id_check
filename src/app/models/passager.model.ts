import { Axe } from './axe.model';
import { Localite } from './localite.model';
import { Personne } from './Personne';
import { Trajet } from './trajet.model';
import { Vehicule } from './vehicule.model';

export interface Passager {
  id?: string; // UUID

  dateDepart?: Localite;
  destination: Localite;
  trajet:Trajet;
  personnes:Personne[];
}

export interface PassagerCreate {
  departId: string;
  destinationId: string;
  trajetId:string;
  personnes: Personne[];
}
