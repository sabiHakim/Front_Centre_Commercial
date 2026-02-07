import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';
import { PanierService } from '../../service/panier/panier.service';
@Component({
  selector: 'app-card-produit',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './card-produit.component.html',
  styleUrl: './card-produit.component.css',
})
export class CardProduitComponent {
  @Input() produit: any;
  @Input() image!: string;
  @Input() boutique!: string;
  @Input() nom!: string;
  @Input() description!: string;
  @Input() prix!: number;
  @Input() stock!: number;
  @Input() boutiqueNom!: string;
  protected readonly StoreIcon = ShoppingCart;
  // panier
  constructor(private panierService: PanierService) {}
  ajouterAuPanier() {
    this.panierService.addProduit(this.produit);
  }

}
