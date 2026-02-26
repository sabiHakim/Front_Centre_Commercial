import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, CheckCircle, XCircle } from 'lucide-angular';
import {
  CommandeclientServiceService,
  CommandeApi,
} from './commandeclient-service.service';
@Component({
  selector: 'app-commande-client',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './commande-client.component.html',
  styleUrl: './commande-client.component.css',
})
export class CommandeClientComponent {
  commandes: CommandeApi[] = [];
  // icônes
  CheckCircleIcon = CheckCircle;
  XCircleIcon = XCircle;

  constructor(private commandeService: CommandeclientServiceService) {}

  ngOnInit() {
    this.load();
  }
  load() {
    this.commandeService.mesCommandes().subscribe({
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
  getDateExpiration(commande: any): Date | null {
  if (!commande?.produits?.length) return null;

  const date = new Date(commande.date_creation);
  const dureeMax = Math.max(...commande.produits.map((p: any) => p.duree ?? 0));

  date.setDate(date.getDate() + dureeMax);
  return date;
}
  // valider(id: number) {
  //   this.commandeService.valider(id);
  //   this.load();
  // }

  // refuser(id: number) {
  //   this.commandeService.refuser(id);
  //   this.load();
  // }
}
