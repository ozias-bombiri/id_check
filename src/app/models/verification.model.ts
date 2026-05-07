export interface CheckRequest {

  identifiant: string;
  nom: string;
  prenom: string;
  userId?: any | null;

}
export interface CheckResponse {
  checkResult: boolean;
  libelleResult?: string | null;
}
