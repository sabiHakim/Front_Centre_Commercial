import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../environnements/environment';
export interface Commande {
  id: number;
  client: string;
  produit: string;
  quantite: number;
  montant: number;
  date: string; // ISO string
  statut: 'en attente' | 'validée' | 'annulée';
}
@Injectable({
  providedIn: 'root',
})
export class CommadeServiceBoutiqueService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllCommande(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/commandes`);
  }
  getAllUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }
  getAllProduit(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/produits`);
  }

  updateCommande(item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/commandes/update/${item._id}`, item);
  }

  addStockOut(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/stocks/create`, item);
  }

  updateProduit(item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/produits/update/${item._id}`, item);
  }






  private commandes: Commande[] = [
    {
      id: 1,
      client: 'Jean',
      produit: 'T-shirt',
      quantite: 2,
      montant: 50000,
      date: '2026-02-09',
      statut: 'en attente',
    },
    {
      id: 2,
      client: 'Rakoto',
      produit: 'Chaussures',
      quantite: 1,
      montant: 120000,
      date: '2026-02-09',
      statut: 'validée',
    },
    {
      id: 3,
      client: 'Lala',
      produit: 'Sac à main',
      quantite: 1,
      montant: 80000,
      date: '2026-02-08',
      statut: 'en attente',
    },
  ];

  getAll(): Commande[] {
    return this.commandes;
  }

  getById(id: number): Commande | undefined {
    return this.commandes.find((c) => c.id === id);
  }

  valider(id: number) {
    const c = this.commandes.find((c) => c.id === id);
    if (c) c.statut = 'validée';
  }

  annuler(id: number) {
    const c = this.commandes.find((c) => c.id === id);
    if (c) c.statut = 'annulée';
  }

  ajouter(commande: Omit<Commande, 'id'>) {
    const newId = this.commandes.length
      ? Math.max(...this.commandes.map((c) => c.id)) + 1
      : 1;
    this.commandes.push({ ...commande, id: newId });
  }
}
