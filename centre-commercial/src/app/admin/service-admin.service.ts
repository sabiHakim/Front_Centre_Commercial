import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServiceAdminService {
  boutiques = [
    {
      id: 1,
      nom: 'Tech World',
      proprietaire: 'Jean',
      email: 'tech@mall.com',
      produits: 12,
      actif: true,
      logo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
      createdAt: '2026-02-05',
    },
    {
      id: 2,
      nom: 'Fashion Store',
      proprietaire: 'Rakoto',
      email: 'fashion@mall.com',
      produits: 25,
      actif: false,
      logo: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd53',
      createdAt: '2026-02-01',
    },
  ];

  getBoutiques() {
    return this.boutiques;
  }

  /** 📊 Stats Dashboard */
  getStats() {
    const total = this.boutiques.length;
    const actives = this.boutiques.filter(b => b.actif).length;
    const desactivees = this.boutiques.filter(b => !b.actif).length;

    // nouvelles = créées aujourd’hui (mock simple)
    const today = new Date().toISOString().split('T')[0];
    const nouvelles = this.boutiques.filter(
      b => b.createdAt === today
    ).length;

    return {
      total,
      actives,
      desactivees,
      nouvelles,
    };
  }

  toggleStatus(id: number) {
    const b = this.boutiques.find(x => x.id === id);
    if (b) b.actif = !b.actif;
  }

  delete(id: number) {
    this.boutiques = this.boutiques.filter(b => b.id !== id);
  }
}

