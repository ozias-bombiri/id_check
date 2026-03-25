import { Compagnie } from './compagnie.model';
import { TypeVehicule } from './type-vehicule.model';

export interface Vehicule {
  id?: string; // UUID
  immatriculation: string;
  etatVehicule: string;
  nombreDePlace: number;
  compagnie?: Compagnie;
  typeVehicule?: TypeVehicule;
}

export interface VehiculeCreate {
  immatriculation: string;
  etatVehicule: string;
  nombreDePlace: number;
  compagnieId: string;
  typeVehiculeId: string;
}
