import { Component, OnInit } from '@angular/core';
import {
  LucideAngularModule,
  Box,
  Package,
  ShoppingCart,
  CreditCard,
  Edit,
  Trash,
} from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { ServiceBoutiqueService, Commande } from '../service-boutique.service';
@Component({
  selector: 'app-acceuil-boutique',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './acceuil-boutique.component.html',
  styleUrl: './acceuil-boutique.component.css',
})
export class AcceuilBoutiqueComponent implements OnInit {
  BoxIcon = Box;
  PackageIcon = Package;
  ShoppingCartIcon = ShoppingCart;
  CreditCardIcon = CreditCard;
  EditIcon = Edit;
  TrashIcon = Trash;
  commandes: Commande[] = [];
  constructor(private boutiqueService: ServiceBoutiqueService) {}
  ngOnInit(): void {
    this.commandes = this.boutiqueService.getCommandes();
  }
}
