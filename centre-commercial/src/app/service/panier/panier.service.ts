import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
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

  addProduit(produit: any) {
    if (produit.stock <= 0) return;

    const exist = this.panier.find(p => p.id === produit.id);
    if (exist) {
      if (exist.quantite < produit.stock) exist.quantite++;
    } else {
      this.panier.push({ ...produit, quantite: 1 });
    }

    this.savePanier();
  }

  removeProduit(id: number) {
    this.panier = this.panier.filter(p => p.id !== id);
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
    return this.panier.reduce((t, p) => t + (p.prix * p.quantite), 0);
  }
}
