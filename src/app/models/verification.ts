import { Personne } from "./Personne";
import { Utilisateur } from "./Utilisateur";

export interface Verification {
    id: number;
    numero: string;
    utilisateur: Utilisateur;
    resultat: string;
    personne: Personne;
}