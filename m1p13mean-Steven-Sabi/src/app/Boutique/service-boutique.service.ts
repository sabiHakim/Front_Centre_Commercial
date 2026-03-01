import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environnements/environment';

export interface Produit {
  _id: string;
  nom: string;
  description: string;
  prix: [];
  stock: number;
  images: [];
  id_boutique: string;
  label:string;
  qte:number;
  solde:[];
  categorie:{};
  etat:{};
  boutique:{};
  duree:number

}
export interface Commande {
  id: number;
  client: string;
  date: string;
  total: number;
  statut: string;
  produits: { produitId: number; quantite: number }[];
}
@Injectable({
  providedIn: 'root',
})
export class ServiceBoutiqueService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}


  getAllBoutique(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/boutiques`);
  }

  getAllUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }

  getAllLoyer(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/loyers`);
  }

  getAllLocal(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/locals`);
  }

  getAllAbonnement(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/abonnements`);
  }

  getAllProduitCatego(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/produits/categories`);
  }

  getAllProduit(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/produits`);
  }

  getAllCommande(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/commandes`);
  }

  createProduit(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/produits/create`, item);
  }

  updateProduit(item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/produits/update/${item._id}`, item);
  }

  updateBoutique(item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/boutiques/update/${item._id}`, item);
  }

  upload(file: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload`, file);
  }

  createInStock(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/stocks/create`, item);
  }

  createDemandeLocal(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/locals/demande/create`, item);
  }

  createDemandeAbonnement(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/abonnements/demande/create`, item);
  }



























  private produits: Produit[] = [
    // {
    //   id: 1,
    //   nom: 'Produit A',
    //   description: 'Description produit A',
    //   prix: 120000,
    //   stock: 10,
    //   images: [
    //     'https://picsum.photos/id/1011/400/300',
    //     'https://picsum.photos/id/1015/400/300',
    //     'https://picsum.photos/id/1016/400/300',
    //   ],
    // },
    // {
    //   id: 2,
    //   nom: 'Produit B',
    //   description: 'Description produit B',
    //   prix: 90000,
    //   stock: 5,
    //   images: [
    //     'https://picsum.photos/id/1011/400/300',
    //     'https://picsum.photos/id/1015/400/300',
    //     'https://picsum.photos/id/1016/400/300',
    //   ],
    // },
    // {
    //   id: 3,
    //   nom: 'Produit C',
    //   description: 'Description produit C',
    //   prix: 45000,
    //   stock: 0,
    //   images: [
    //     'https://picsum.photos/id/1011/400/300',
    //     'https://picsum.photos/id/1015/400/300',
    //     'https://picsum.photos/id/1016/400/300',
    //   ],
    // },
  ];
  // =========================
  // PRODUITS
  // =========================
  getProduits(): Produit[] {
    return this.produits;
  }

  // ajouterProduit(produit: Produit) {
  //   produit._id = this.produits.length + 1;
  //   this.produits.push(produit);
  // }

  modifierProduit(updated: Produit) {
    const index = this.produits.findIndex((p) => p._id === updated._id);
    if (index !== -1) this.produits[index] = updated;
  }
  supprimerProduit(id: number) {
    // this.produits = this.produits.filter((p) => p._id !== id);
  }

  private commandes: Commande[] = [
    {
      id: 101,
      client: 'Rakoto',
      date: '2026-02-06',
      total: 150000,
      statut: 'En cours',
      produits: [{ produitId: 1, quantite: 1 }],
    },
    {
      id: 102,
      client: 'Jean',
      date: '2026-02-05',
      total: 230000,
      statut: 'Livrée',
      produits: [{ produitId: 2, quantite: 2 }],
    },
  ];
  // =========================
  // COMMANDES
  // =========================
  getCommandes(): Commande[] {
    return this.commandes;
  }

  ajouterCommande(commande: Commande) {
    this.commandes.push(commande);
  }

  modifierCommande(updated: Commande) {
    const index = this.commandes.findIndex((c) => c.id === updated.id);
    if (index !== -1) {
      this.commandes[index] = updated;
    }
  }
  supprimerCommande(id: number) {
    this.commandes = this.commandes.filter((c) => c.id !== id);
  }
}
