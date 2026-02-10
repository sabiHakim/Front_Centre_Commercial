import { Injectable } from '@angular/core';

export interface Paiement {
  mois: number;   // 1 = Janvier
  annee: number;  // 2026
  paye: boolean;
}

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
      loyer: 500000,
      logo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
      createdAt: '2026-02-05',
      paiements: [
        { mois: 1, annee: 2026, paye: true },
        { mois: 2, annee: 2026, paye: false },
      ] as Paiement[],
    },
    {
      id: 2,
      nom: 'Fashion Store',
      proprietaire: 'Rakoto',
      email: 'fashion@mall.com',
      produits: 25,
      actif: false,
      loyer: 450000,
      logo: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd53',
      createdAt: '2026-02-01',
      paiements: [
        { mois: 1, annee: 2026, paye: true },
        { mois: 2, annee: 2026, paye: true },
      ] as Paiement[],
    },
  ];

  /* =========================
     BOUTIQUES
  ========================== */
  getBoutiques() {
    return this.boutiques;
  }

  /* =========================
     PAIEMENT MENSUEL
  ========================== */
  payerMois(boutiqueId: number, mois: number, annee: number) {
    const boutique = this.boutiques.find(b => b.id === boutiqueId);
    if (!boutique) return;

    let paiement = boutique.paiements.find(
      p => p.mois === mois && p.annee === annee
    );

    if (!paiement) {
      boutique.paiements.push({ mois, annee, paye: true });
    } else {
      paiement.paye = true;
    }
  }

  estPaye(boutiqueId: number, mois: number, annee: number): boolean {
    const boutique = this.boutiques.find(b => b.id === boutiqueId);
    if (!boutique) return false;

    return !!boutique.paiements.find(
      p => p.mois === mois && p.annee === annee && p.paye
    );
  }

  /* =========================
     STATS (PAR MOIS)
  ========================== */
  getStats(mois: number, annee: number) {
    const total = this.boutiques.length;

    const payes = this.boutiques.filter(b =>
      b.paiements.some(
        p => p.mois === mois && p.annee === annee && p.paye
      )
    ).length;

    const nonPayes = total - payes;

    const revenus = this.boutiques
      .filter(b =>
        b.paiements.some(
          p => p.mois === mois && p.annee === annee && p.paye
        )
      )
      .reduce((sum, b) => sum + b.loyer, 0);

    return {
      total,
      actives: payes,
      desactivees: nonPayes,
      nouvelles: revenus,
    };
  }

  /* =========================
     AUTRES ACTIONS
  ========================== */
  toggleStatus(id: number) {
    const b = this.boutiques.find(x => x.id === id);
    if (b) b.actif = !b.actif;
  }

  delete(id: number) {
    this.boutiques = this.boutiques.filter(b => b.id !== id);
  }
}
