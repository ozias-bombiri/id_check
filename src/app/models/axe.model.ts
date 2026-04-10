import { Compagnie } from './compagnie.model';
import { Localite } from './localite.model';
import { TypeVehicule } from './type-vehicule.model';

export interface Axe {
  id: string; // UUID
  libelle: string;
  description: string;
  depart?: Localite;
  arrive?: Localite;
}

export interface AxeCreate {
  libelle: string;
  description: string;
  departId: string;
  arriveId: string;
}
