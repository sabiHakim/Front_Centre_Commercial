import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ClientService,
  Produit,
  Boutique,
  Categorie,
} from '../../service/Client/client.service';
import { CardProduitComponent } from '../../layout/card-produit/card-produit.component';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';
import { PanierService } from '../../service/panier/panier.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    CommonModule,
    CardProduitComponent,
    FormsModule,
    LucideAngularModule,
    RouterModule,
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  protected readonly StoreIcon = ShoppingCart;
  produits: Produit[] = [];
  boutiques: Boutique[] = [];
  categorie: Categorie[] = [];
  selectedCategorieId: number | '' = '';
  selectedBoutiqueId: number | '' = '';
  searchTerm: string = '';
  prixMin: number | null = null;
  prixMax: number | null = null;
  constructor(
    private clientService: ClientService,
    public panierService: PanierService,
  ) {}
  ngOnInit(): void {
    this.clientService.getProduits().subscribe({
      next: (data) => (this.produits = data),
      error: (err) => console.error(err),
    });
    this.clientService.getBoutiques().subscribe((res) => {
      this.boutiques = res;
    });
    this.clientService.getCategorie().subscribe((res) => {
      this.categorie = res;
    });
  }
  getNomBoutique(id_boutique: number): string {
    const boutique = this.boutiques.find((b) => b._id === id_boutique);
    return boutique ? boutique.nom : 'Boutique inconnue';
  }
  getSoldeActif(produit: Produit): number | null {
    const today = new Date();
    if (!produit.solde || produit.solde.length === 0) return null;

    const soldeActif = produit.solde.find((s) => {
      const debut = new Date(s.debut);
      const fin = new Date(s.fin);
      return today >= debut && today <= fin;
    });

    return soldeActif ? soldeActif.pourcentage : null;
  }
  getPrixActuel(produit: Produit): number {
    return produit.prix?.[produit.prix.length - 1]?.montant ?? 0;
  }
  /** Produits filtrés par catégorie */
  get produitsFiltres(): Produit[] {
    let resultat = this.produits;
    // 1. Recherche texte (souvent mis en premier car c'est le filtre le plus utilisé)
    if (this.searchTerm?.trim()) {
      const terme = this.searchTerm.trim().toLowerCase();
      resultat = resultat.filter(
        (p) =>
          p.label?.toLowerCase().includes(terme) ||
          p.description?.toLowerCase().includes(terme),
        // Tu peux aussi chercher dans les catégories si tu veux :
        // || p.categories?.some(c => c.label?.toLowerCase().includes(terme))
      );
    }
    // 1. Filtre catégorie
    if (this.selectedCategorieId !== '' && this.selectedCategorieId != null) {
      const catId = Number(this.selectedCategorieId);
      resultat = resultat.filter((p) =>
        p.categories?.some((c) => Number(c.id) === catId),
      );
    }
    // 2. Filtre prix
    if (this.prixMin != null && this.prixMin > 0) {
      resultat = resultat.filter((p) => this.getPrixActuel(p) >= this.prixMin!);
    }
    if (this.prixMax != null && this.prixMax > 0) {
      resultat = resultat.filter((p) => this.getPrixActuel(p) <= this.prixMax!);
    }
    // 3-filtre-boutique
    if (this.selectedBoutiqueId !== '' && this.selectedBoutiqueId != null) {
      const boutiqueId = Number(this.selectedBoutiqueId);
      resultat = resultat.filter((p) => Number(p.id_boutique) === boutiqueId);
    }
    return resultat;
  }
  // filtre prix
  resetFiltresPrix() {
    this.prixMin = null;
    this.prixMax = null;
  }
}
