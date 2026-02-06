import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../service/Client/client.service';
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
    RouterModule
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  protected readonly StoreIcon = ShoppingCart;
  produits: any[] = [];
  boutiques: any[] = [];
  searchTerm: string = '';
  constructor(private clientService: ClientService,public panierService: PanierService) {}
  ngOnInit(): void {
    this.boutiques = this.clientService.getBoutiques();
    this.produits = this.clientService.getProduits();
  }
  getNomBoutique(boutiqueId: number): string {
    const boutique = this.boutiques.find((b) => b.id === boutiqueId);
    return boutique ? boutique.nom : '';
  }
  get filteredProduits() {
    return this.produits.filter((p) =>
      p.nom.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }
}
