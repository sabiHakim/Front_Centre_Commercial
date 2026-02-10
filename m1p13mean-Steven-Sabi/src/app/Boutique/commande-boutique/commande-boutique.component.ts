import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, CheckCircle, XCircle } from 'lucide-angular';
import {
  CommadeServiceBoutiqueService,
  Commande,
} from './commade-service-boutique.service';
@Component({
  selector: 'app-commande-boutique',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './commande-boutique.component.html',
  styleUrl: './commande-boutique.component.css',
})
export class CommandeBoutiqueComponent {
  commandes: Commande[] = [];

  // Icônes
  CheckCircleIcon = CheckCircle;
  XCircleIcon = XCircle;

  constructor(private commandeService: CommadeServiceBoutiqueService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.commandes = this.commandeService.getAll();
  }

  valider(id: number) {
    this.commandeService.valider(id);
    this.load();
  }

  annuler(id: number) {
    this.commandeService.annuler(id);
    this.load();
  }
}
