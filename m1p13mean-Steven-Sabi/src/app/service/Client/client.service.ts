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
  id: number;
  label: string;
}

export interface EtatProduit {
  _id: number;
  libelle: string;
}

export interface Produit {
  _id: number;
  id_boutique: number;
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

}