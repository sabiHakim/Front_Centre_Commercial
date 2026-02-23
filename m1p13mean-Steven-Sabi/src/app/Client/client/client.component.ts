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
    RouterModule,
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  protected readonly StoreIcon = ShoppingCart;
  produits: any[] = [];
  boutiques: any[] = [];
  searchTerm: string = '';
  constructor(
    private clientService: ClientService,
    public panierService: PanierService,
  ) {}
  ngOnInit(): void {
    this.clientService.getProduits().subscribe({
      next: (data) => (this.produits = data),
      error: (err) => console.error(err),
    });
  }
 
}
