import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceBoutiqueService, Produit } from '../service-boutique.service';
import { LucideAngularModule, Edit, Trash, Package } from 'lucide-angular';
@Component({
  selector: 'app-produit-boutique',
  standalone: true,
  imports: [CommonModule, LucideAngularModule,FormsModule],
  templateUrl: './produit-boutique.component.html',
  styleUrl: './produit-boutique.component.css',
})
export class ProduitBoutiqueComponent implements OnInit {
  EditIcon = Edit;
  TrashIcon = Trash;
  PackageIcon = Package;
  produits: Produit[] = [];
  constructor(private boutiqueService: ServiceBoutiqueService) {}

  modalOuvert = false;
  nouveauProduit: Produit = {
    id: 0,
    nom: '',
    description: '',
    prix: 0,
    stock: 0,
    image: '',
  };
  ngOnInit(): void {
    this.produits = this.boutiqueService.getProduits();
  }
  ajouterProduit() {
    const nom = prompt('Nom du produit');
    if (!nom) return;

    const description =
      prompt('Description du produit', 'Description ...') || '';
    const prix = parseInt(prompt('Prix du produit', '0') || '0', 10);
    const stock = parseInt(prompt('Stock', '0') || '0', 10);
    const image = prompt('URL image', 'https://picsum.photos/400/300') || '';

    this.boutiqueService.ajouterProduit({
      id: 0,
      nom,
      description,
      prix,
      stock,
      image,
    });
    this.produits = this.boutiqueService.getProduits();
  }
  ouvrirModal() {
    this.nouveauProduit = {
      id: 0,
      nom: '',
      description: '',
      prix: 0,
      stock: 0,
      image: '',
    };
    this.modalOuvert = true;
  }

  fermerModal() {
    this.modalOuvert = false;
  }

  confirmerAjout() {
    this.boutiqueService.ajouterProduit(this.nouveauProduit);
    this.produits = this.boutiqueService.getProduits();
    this.modalOuvert = false;
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
}
