import { Component } from '@angular/core';
import { PanierService } from '../../service/panier/panier.service';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ShoppingCart,
  Trash2,
  Package,
  CreditCard,
} from 'lucide-angular';
import { CommandeclientServiceService } from '../../Client/commande-client/commandeclient-service.service';
@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.css',
})
export class PanierComponent {
  ShoppingCartIcon = ShoppingCart;
  TrashIcon = Trash2;
  PackageIcon = Package;
  CreditCardIcon = CreditCard;
  constructor(
    public panierService: PanierService,
    private commandeService: CommandeclientServiceService,
  ) {}
  supprimer(id: number) {
    this.panierService.removeProduit(id);
  }
  commander() {
    const panier = this.panierService.getPanier();
    if (!panier || panier.length === 0) {
      alert('Panier vide');
      return;
    }
    const commande = {
      labele: "Commande d'utilisateur",
      produits: panier.map((p: any) => ({
        id: p._id,
        nom: p.label,
        qte: p.quantite,
        duree: p.duree_panier,
      })),
    };
    this.commandeService.creerCommande(commande).subscribe({
      next: (res) => {
        console.log('Commande envoyée', res);
        alert('Commande créée avec succès ');
        this.panierService.clearPanier();
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la commande ');
      },
    });
  }
}
