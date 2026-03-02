import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Produit } from '../Client/client.service';

@Injectable({
  providedIn: 'root',
})
export class PanierService {
  private panier: any[] = [];
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.loadPanier();
  }

  private savePanier() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('panier', JSON.stringify(this.panier));
    }
  }

  private loadPanier() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('panier');
      this.panier = data ? JSON.parse(data) : [];
    } else {
      this.panier = [];
    }
  }

  getPanier() {
    return this.panier;
  }
  getPrixAvecSolde(produit: Produit): number {
    const prixActuel = produit.prix[produit.prix.length - 1].montant;
    const today = new Date();
    const soldeActif = produit.solde?.find((s) => {
      const debut = new Date(s.debut);
      const fin = new Date(s.fin);
      return today >= debut && today <= fin;
    });
    if (soldeActif) {
      return prixActuel - ((prixActuel * soldeActif.pourcentage) / 100);
      // return (prixActuel * soldeActif.pourcentage) / 100;

    }
    return prixActuel;
  }
  addProduit(produit: Produit) {
    if (produit.qte <= 0) return;
    const exist = this.panier.find((p) => p._id === produit._id);
    if (exist) {
      if (exist.quantite < produit.qte) exist.quantite++;
    } else {
      const prixFinal = this.getPrixAvecSolde(produit);

      this.panier.push({
        ...produit,
        quantite: 1,
        prix: [
          {
            date: new Date(),
            montant: prixFinal,
          },
        ],
      });
    }
    this.savePanier();
  }

  removeProduit(id: number) {
    this.panier = this.panier.filter((p) => p._id !== id);
    this.savePanier();
  }

  clearPanier() {
    this.panier = [];
    this.savePanier();
  }

  getTotalCount(): number {
    return this.panier.reduce((t, p) => t + p.quantite, 0);
  }

  getTotalPrix(): number {
    return this.panier.reduce(
      (t, p) => t + (p.prix[p.prix.length - 1]?.montant ?? 0) * p.quantite,
      0,
    );
  }
}
//  this.panier.push({
//       ...produit,
//       quantite: 1,
//       prixUnitaire: this.getPrixFinal(produit) 
//     });