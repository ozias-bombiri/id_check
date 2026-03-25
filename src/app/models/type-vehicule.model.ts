export interface TypeVehicule {
  id?: string;
  libelle: string;
  description?: string;
}

export type TypeVehiculeCreate = Omit<TypeVehicule, 'id'>;
