import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../service/Client/client.service';
import { CardProduitComponent } from '../../layout/card-produit/card-produit.component';
@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule,CardProduitComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  produits: any[] = [];
  boutiques: any[] = [];
  constructor(private clientService: ClientService) {}
  ngOnInit(): void {
    this.boutiques = this.clientService.getBoutiques();
    this.produits = this.clientService.getProduits();
  }
  getNomBoutique(boutiqueId: number): string {
  const boutique = this.boutiques.find(b => b.id === boutiqueId);
  return boutique ? boutique.nom : '';
}

}
