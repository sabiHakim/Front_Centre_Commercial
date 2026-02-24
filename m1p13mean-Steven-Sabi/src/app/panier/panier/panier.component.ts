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
  constructor(public panierService: PanierService) {}
  supprimer(id: number) {
    this.panierService.removeProduit(id);
  }
  commander(){
    
  }
}
