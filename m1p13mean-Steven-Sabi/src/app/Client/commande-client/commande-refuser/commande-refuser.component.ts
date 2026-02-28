import { Component, OnInit } from '@angular/core';
import {
  CommandeApi,
  CommandeclientServiceService,
} from '../commandeclient-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-commande-refuser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-refuser.component.html',
  styleUrl: './commande-refuser.component.css',
})
export class CommandeRefuserComponent implements OnInit {
  commandes: CommandeApi[] = [];
  constructor(private commandeService: CommandeclientServiceService) {}
  ngOnInit() {
    this.load();
  }
  load() {
    this.commandeService.mesCommandesRefuser().subscribe({
      next: (data) => {
        this.commandes = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getTotalCommande(produits: { qte: number; prix: number }[]): number {
    return produits.reduce((total, p) => total + p.qte * p.prix, 0);
  }
}
