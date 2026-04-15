export interface Localite {
  id: string; // UUID from backend
  libelle: string;
  description?: string;
  typeLocalite: 'urbaine' | 'rurale';
}

export type LocaliteCreate = Omit<Localite, 'id'>;
