import { Injectable } from '@angular/core';
export interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  images: string[];
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
  constructor() {}
  private produits: Produit[] = [
    {
      id: 1,
      nom: 'Produit A',
      description: 'Description produit A',
      prix: 120000,
      stock: 10,
      images: [
        'https://picsum.photos/id/1011/400/300',
        'https://picsum.photos/id/1015/400/300',
        'https://picsum.photos/id/1016/400/300',
      ],
    },
    {
      id: 2,
      nom: 'Produit B',
      description: 'Description produit B',
      prix: 90000,
      stock: 5,
      images: [
        'https://picsum.photos/id/1011/400/300',
        'https://picsum.photos/id/1015/400/300',
        'https://picsum.photos/id/1016/400/300',
      ],
    },
    {
      id: 3,
      nom: 'Produit C',
      description: 'Description produit C',
      prix: 45000,
      stock: 0,
      images: [
        'https://picsum.photos/id/1011/400/300',
        'https://picsum.photos/id/1015/400/300',
        'https://picsum.photos/id/1016/400/300',
      ],
    },
  ];
  // =========================
  // PRODUITS
  // =========================
  getProduits(): Produit[] {
    return this.produits;
  }

  ajouterProduit(produit: Produit) {
    produit.id = this.produits.length + 1;
    this.produits.push(produit);
  }

  modifierProduit(updated: Produit) {
    const index = this.produits.findIndex((p) => p.id === updated.id);
    if (index !== -1) this.produits[index] = updated;
  }
  supprimerProduit(id: number) {
    this.produits = this.produits.filter((p) => p.id !== id);
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
