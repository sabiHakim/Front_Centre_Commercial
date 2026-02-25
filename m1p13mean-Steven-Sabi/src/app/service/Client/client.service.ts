import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environnements/environment';

/* ===== INTERFACES ===== */
export interface ImageProduit {
  message: string;
  url: string;
  originalName: string;
  format: string;
  size: number;
}

export interface PrixProduit {
  date: string;
  montant: number;
}

export interface SoldeProduit {
  debut: string;
  fin: string;
  pourcentage: number;
}

export interface CategorieProduit {
  id: string;
  label: string;
}

export interface EtatProduit {
  _id: string;
  libelle: string;
}

export interface Produit {
  _id: string;
  id_boutique: string;
  label: string;
  description: string;
  qte: number;
  images: ImageProduit[];
  prix: PrixProduit[];
  solde: SoldeProduit[];
  categories: CategorieProduit[];
  etat: EtatProduit;
  duree_panier: number;
  date_creation: string;
  date_update: string;
}
export interface Boutique {
  _id: string;
  nom: string;
  description: string;
  logo: string;
  fond: string;
  users: { id_user: string; email: string }[];
  local: { id: string; position: string; loyer: number; date: string }[];
  abonnement: { id: string; libelle: string; montant: number; date: string }[];
  date_creation: string;
  date_update: string;
}

export interface BaseCategorie {
  id: string;
  label: string;
}

export interface Categorie {
  _id: string;
  label: string;
  description: string;
  base: BaseCategorie | null;
}
@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET tous les produits (API) */
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/produits`);
  }
  getBoutiques(): Observable<Boutique[]> {
    return this.http.get<Boutique[]>(`${this.apiUrl}/boutiques`);
  }
  getCategorie(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/produits/categories`);
  }
}
