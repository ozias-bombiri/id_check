import { Localite } from './localite.model';

export interface Axe {
  id: string; // UUID
  libelle: string;
  distance:number;
  tempsMoyen:number;
  description: string;
  depart?: Localite;
  arrive?: Localite;
  itineraire?: Localite[];
}

export interface AxeCreate {
  libelle: string;
  distance:number;
  tempsMoyen:number;
  description: string;
  departId: string;
  arriveId: string;
  itineraire: string[];
}
