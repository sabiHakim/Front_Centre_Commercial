import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceBoutiqueService, Produit } from '../service-boutique.service';
import { LucideAngularModule, Edit, Trash, Package } from 'lucide-angular';
import { OnDestroy } from '@angular/core';
@Component({
  selector: 'app-produit-boutique',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './produit-boutique.component.html',
  styleUrl: './produit-boutique.component.css',
})
export class ProduitBoutiqueComponent implements OnInit, OnDestroy {
  //on destroys
  autoSlideIntervals: { [key: number]: any } = {};

  startAutoSlide(produit: Produit) {
    this.autoSlideIntervals[produit.id] = setInterval(() => {
      this.nextImage(produit);
    }, 3000); // change toutes les 3 secondes
  }
  ngOnDestroy(): void {
    Object.values(this.autoSlideIntervals).forEach((interval) =>
      clearInterval(interval),
    );
  }
  EditIcon = Edit;
  TrashIcon = Trash;
  PackageIcon = Package;

  produits: Produit[] = [];

  constructor(private boutiqueService: ServiceBoutiqueService) {}

  modalOuvert = false;

  // Pour stocker les index des images par produit
  currentImageIndex: { [key: number]: number } = {};

  // Champ texte pour saisir plusieurs URLs
  imagesInput: string = '';

  nouveauProduit: Produit = {
    id: 0,
    nom: '',
    description: '',
    prix: 0,
    stock: 0,
    images: [],
  };

  ngOnInit(): void {
    this.produits = this.boutiqueService.getProduits();
    this.produits.forEach((produit) => {
      if (this.hasMultipleImages(produit)) {
        this.startAutoSlide(produit);
      }
    });
  }

  ouvrirModal() {
    this.nouveauProduit = {
      id: 0,
      nom: '',
      description: '',
      prix: 0,
      stock: 0,
      images: [],
    };
    this.imagesInput = '';
    this.modalOuvert = true;
  }

  fermerModal() {
    this.modalOuvert = false;
  }

  confirmerAjout() {
    // Convertir texte en tableau
    this.nouveauProduit.images = this.imagesInput
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url !== '');

    this.boutiqueService.ajouterProduit(this.nouveauProduit);
    this.produits = this.boutiqueService.getProduits();

    this.modalOuvert = false;
    this.imagesInput = '';
  }

  modifierProduit(produit: Produit) {
    const nouveauNom = prompt('Modifier le nom du produit', produit.nom);
    if (nouveauNom) {
      this.boutiqueService.modifierProduit({ ...produit, nom: nouveauNom });
      this.produits = this.boutiqueService.getProduits();
    }
  }

  supprimerProduit(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.boutiqueService.supprimerProduit(id);
      this.produits = this.boutiqueService.getProduits();
    }
  }
  hasImages(produit: Produit): boolean {
    return !!produit.images && produit.images.length > 0;
  }

  hasMultipleImages(produit: Produit): boolean {
    return !!produit.images && produit.images.length > 1;
  }

  // =========================
  // SLIDER LOGIQUE
  // =========================

  nextImage(produit: Produit) {
    const current = this.currentImageIndex[produit.id] || 0;
    const next = (current + 1) % produit.images.length;
    this.currentImageIndex[produit.id] = next;
  }

  prevImage(produit: Produit) {
    const current = this.currentImageIndex[produit.id] || 0;
    const prev = (current - 1 + produit.images.length) % produit.images.length;
    this.currentImageIndex[produit.id] = prev;
  }

  getCurrentImage(produit: Produit): string {
    if (!produit.images || produit.images.length === 0) {
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }
    const index = this.currentImageIndex[produit.id] ?? 0;
    return produit.images[index];
  }
}
