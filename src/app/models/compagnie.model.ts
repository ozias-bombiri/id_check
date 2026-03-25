export interface Compagnie {
  id?: string; // UUID
  abrege: string;
  nomCompagnie: string;
  telephone?: string;
  email?: string;
  siege?: string;
  description?: string;
}

export type CompagnieCreate = Omit<Compagnie, 'id'>;
