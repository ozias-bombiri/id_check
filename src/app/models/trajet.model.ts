import { Axe } from './axe.model';
import { Localite } from './localite.model';
import { Vehicule } from './vehicule.model';

export interface Trajet {
  id?: string; // UUID
  libelle: string;
  description: string;
  dateDepart?: Date;
  heureDepart: string;
  axe:Axe;
  vehicule:Vehicule;
}

export interface TrajetCreate {
  dateDepart: Date;
  heureDepart: string;
  axeId:string;
  vehiculeId: string;
}
