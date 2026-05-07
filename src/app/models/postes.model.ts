import { Axe } from "./axe.model";

export interface PosteControle {
  id?: string; // UUID from backend
  libelle: string;
  description?: string;
  etatPoste: true | false;
  axes: Axe[]
}
export interface AxePoste {
  idAxe : string
}

export interface PosteControleCreate {

  libelle: string;
  description?: string;
  etatPoste: true | false;
  axes : string[];
}
