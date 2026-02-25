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
  selectedCategorieId: string | null = null;
  selectedBoutiqueId: string | null = null;
  searchTerm: string = '';
  prixMin: number | null = null;
  prixMax: number | null = null;
  prixErreur: string | null = null;
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
  getNomBoutique(id_boutique: string): string {
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

    // 🔍 Recherche
    if (this.searchTerm?.trim()) {
      const terme = this.searchTerm.toLowerCase();
      resultat = resultat.filter(
        (p) =>
          p.label?.toLowerCase().includes(terme) ||
          p.description?.toLowerCase().includes(terme),
      );
    }

    // 📂 Catégorie
    if (this.selectedCategorieId !== null) {
      const catId = this.selectedCategorieId;
      resultat = resultat.filter((p) =>
        p.categories?.some((c) => c.id === catId),
      );
    }

    // 🏪 Boutique
    if (this.selectedBoutiqueId !== null) {
      resultat = resultat.filter(
        (p) => p.id_boutique === this.selectedBoutiqueId,
      );
    }

    // 💰 Prix
    this.prixErreur = null;
    if (
      this.prixMin != null &&
      this.prixMax != null &&
      this.prixMin > this.prixMax
    ) {
      this.prixErreur =
        'Le prix minimum doit être inférieur ou égal au prix maximum.';
      return []; // ne renvoie aucun produit si erreur
    }

    if (this.prixMin != null) {
      resultat = resultat.filter((p) => this.getPrixActuel(p) >= this.prixMin!);
    }

    if (this.prixMax != null) {
      resultat = resultat.filter((p) => this.getPrixActuel(p) <= this.prixMax!);
    }

    return resultat;
  }
  onCategorieChange(value: string | null) {
    this.selectedCategorieId = value === 'null' ? null : value;
  }
  onPrixChange() {
  if (this.prixMin != null && this.prixMax != null && this.prixMin > this.prixMax) {
    this.prixErreur = 'Le prix minimum doit être inférieur ou égal au prix maximum.';
  } else {
    this.prixErreur = null;
  }
}
  // filtre prix
  resetFiltresPrix() {
    this.prixMin = null;
    this.prixMax = null;
  }
}
