import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environnements/environment';
export interface CommandeApi {
  _id: string;
  label: string;
  produits: {
    nom: string;
    qte: number;
    duree: number;
    prix:number;
  }[];
  statut: {
    libelle: string;
  };
  date_creation: string;
}
@Injectable({
  providedIn: 'root',
})
export class CommandeclientServiceService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.apiUrl;
  creerCommande(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/commandes/create`, data);
  }
  mesCommandes(): Observable<CommandeApi[]> {
    return this.http.get<CommandeApi[]>(
      `${this.apiUrl}/commandes/mes-commandes`,
    );
  }
  // valider(id: number) {
  //   const c = this.commandes.find((c) => c.id === id);
  //   if (c) c.statut = 'validée';
  // }

  // refuser(id: number) {
  //   const c = this.commandes.find((c) => c.id === id);
  //   if (c) c.statut = 'refusée';
  // }

  // ajouter(commande: Omit<CommandeClient, 'id'>) {
  //   const newId = this.commandes.length
  //     ? Math.max(...this.commandes.map((c) => c.id)) + 1
  //     : 1;
  //   this.commandes.push({ ...commande, id: newId });
  // }
}
