import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  DollarSign ,
} from 'lucide-angular';
@Component({
  selector: 'app-loyer-boutique',
  standalone: true,
  imports: [LucideAngularModule,CommonModule],
  templateUrl: './loyer-boutique.component.html',
  styleUrl: './loyer-boutique.component.css',
})
export class LoyerBoutiqueComponent implements OnInit {
  PlusCircleIcon = DollarSign;
  boutique = {
    id: 1,
    nom: 'Tech World',
    loyer: 500000,
    paiements: [
      { mois: 1, annee: 2026, paye: true },
      { mois: 2, annee: 2026, paye: false },
    ],
  };
  annee = 2026;
  mois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];

  ngOnInit(): void {}

  estPaye(mois: number): boolean {
    return !!this.boutique.paiements.find(
      p => p.mois === mois && p.annee === this.annee && p.paye
    );
  }
  payer(mois: number) {
    const paiement = this.boutique.paiements.find(
      p => p.mois === mois && p.annee === this.annee
    );

    if (paiement) {
      paiement.paye = true;
    } else {
      this.boutique.paiements.push({
        mois,
        annee: this.annee,
        paye: true,
      });
    }
  }
}
