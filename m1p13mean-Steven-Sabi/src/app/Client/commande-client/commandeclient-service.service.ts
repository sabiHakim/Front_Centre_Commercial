import { Injectable } from '@angular/core';
export interface CommandeClient {
  id: number;
  produit: string;
  quantite: number;
  montant: number;
  date: string; // ISO
  statut: 'en attente' | 'validée' | 'refusée';
  clientId: number; // id du client
}
@Injectable({
  providedIn: 'root',
})
export class CommandeclientServiceService {
  private commandes: CommandeClient[] = [
    {
      id: 1,
      produit: 'T-shirt',
      quantite: 2,
      montant: 50000,
      date: '2026-02-09',
      statut: 'en attente',
      clientId: 1,
    },
    {
      id: 2,
      produit: 'Chaussures',
      quantite: 1,
      montant: 120000,
      date: '2026-02-09',
      statut: 'validée',
      clientId: 1,
    },
    {
      id: 3,
      produit: 'Sac à main',
      quantite: 1,
      montant: 80000,
      date: '2026-02-08',
      statut: 'en attente',
      clientId: 2,
    },
  ];

  // récupérer toutes les commandes pour un client
  getByClient(clientId: number): CommandeClient[] {
    return this.commandes.filter((c) => c.clientId === clientId);
  }

  valider(id: number) {
    const c = this.commandes.find((c) => c.id === id);
    if (c) c.statut = 'validée';
  }

  refuser(id: number) {
    const c = this.commandes.find((c) => c.id === id);
    if (c) c.statut = 'refusée';
  }

  ajouter(commande: Omit<CommandeClient, 'id'>) {
    const newId = this.commandes.length
      ? Math.max(...this.commandes.map((c) => c.id)) + 1
      : 1;
    this.commandes.push({ ...commande, id: newId });
  }
}
