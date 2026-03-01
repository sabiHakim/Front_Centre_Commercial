import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environnements/environment';

export interface Paiement {
  mois: number;   // 1 = Janvier
  annee: number;  // 2026
  paye: boolean;
}

export interface Boutique {
  _id: string;
  nom: string;
  description: string;
  logo: string;
  fond: string;
  users: { id_user: string; nom: string, prenom:string, contact:string, email: string }[];
  local: { id: string; position: string; loyer: number; date: string }[];
  abonnement: { id: string; libelle: string; montant: number; date: string }[];
  date_creation: string;
  date_update: string;
}

export interface Loyer {
  _id: string;
  id_boutique: string;
  montant: number;
  montant_payer: number;
  mois: number;        // 1 - 12
  annee: number;       // ex: 2025
  boutique: Boutique;
  date_creation: string;  // ISO string
  date_update: string;    // ISO string
}

export interface Role {
  id: number;
  label: string;
}

export interface User {
  nom: string;
  prenom: string;
  password: string;
  email: string;
  contact: string;
  role: Role;
  date_creation: string;  // ISO date
  date_update: string;    // ISO date
}

@Injectable({
  providedIn: 'root',
})
export class ServiceAdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  
  getAllBoutiques(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/boutiques`);
  }

  getAllLoyer(): Observable<Loyer[]> {
    return this.http.get<Loyer[]>(`${this.apiUrl}/loyers`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getAllLocals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/locals`);
  }

  createLoyer(loyer: Partial<Loyer>): Observable<Loyer> {
    return this.http.post<Loyer>(`${this.apiUrl}/loyers/create`, loyer);
  }

  createBoutique(boutique: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/boutiques/create`, boutique);
  }

  updateLocal(local: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/locals/update/${local._id}`, local);
  }

  updateUser(item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/update/${item._id}`, item);
  }

  updateBoutique(item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/boutiques/update/${item._id}`, item);
  }

  getAllAbonnement(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/abonnements`);
  }

  createCategorie(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/produits/categories/create`, item);
  }

  





















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
