import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, CheckCircle, XCircle } from 'lucide-angular';
import { CommandeclientServiceService,CommandeClient } from './commandeclient-service.service';
@Component({
  selector: 'app-commande-client',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './commande-client.component.html',
  styleUrl: './commande-client.component.css',
})
export class CommandeClientComponent {
  commandes: CommandeClient[] = [];
  clientId = 1; // mock : client connecté id=1

  // icônes
  CheckCircleIcon = CheckCircle;
  XCircleIcon = XCircle;

  constructor(private commandeService: CommandeclientServiceService) {}

  ngOnInit() {
    this.load();
  }


  load() {
    this.commandes = this.commandeService.getByClient(this.clientId);
  }

  valider(id: number) {
    this.commandeService.valider(id);
    this.load();
  }

  refuser(id: number) {
    this.commandeService.refuser(id);
    this.load();
  }
}
