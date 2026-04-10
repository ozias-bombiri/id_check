export interface Personne {
    id: string;
    numero: string;
    email: string;
    role: string;
    nom: string;
    prenom: string;
    dateNaissance : Date;
    lieuNaissance : string;
    sexe: string;
    taille: number;
    profession : string;
    photo : string;

}

export interface PersonneCreate {
    id?: string;
    numero: string;
    nom: string;
    prenom: string;

}
