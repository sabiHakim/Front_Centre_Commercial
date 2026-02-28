import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environnements/environment';

export interface Abonnement {
  id: number;
  label: string;
  montant: number;
  description: string;
  prioriter: number;
  date: string; // ISO string
}
@Injectable({
  providedIn: 'root',
})
export class AbonnementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllAbonnement(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/abonnements`);
  }

  getBoutiqueById(id : String): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/boutiques/ById/${id}`);
  }

  getAllAbonnementDemande(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/abonnements/demande`);
  }

  createAbonnement(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/abonnements/create`, item);
  }

  updateAbonnement(item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/abonnements/update/${item._id}`, item);
  }

  updateAbonnementDemande(item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/abonnements/demande/update/${item._id}`, item);
  }

  updateBoutique(item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/boutiques/update/${item._id}`, item);
  }










  private abonnements: Abonnement[] = [
    {
      id: 1,
      label: 'Basique',
      montant: 10000,
      description: 'Abonnement mensuel basique',
      prioriter: 1,
      date: '2026-02-01',
    },
    {
      id: 2,
      label: 'Pro',
      montant: 25000,
      description: 'Abonnement trimestriel pro',
      prioriter: 2,
      date: '2026-02-01',
    },
  ];

  getAll(): Abonnement[] {
    return this.abonnements;
  }

  getById(id: number): Abonnement | undefined {
    return this.abonnements.find((a) => a.id === id);
  }

  add(abonnement: Omit<Abonnement, 'id'>) {
    const newId = this.abonnements.length
      ? Math.max(...this.abonnements.map((a) => a.id)) + 1
      : 1;
    this.abonnements.push({ ...abonnement, id: newId });
  }

  update(id: number, abonnement: Partial<Omit<Abonnement, 'id'>>) {
    const index = this.abonnements.findIndex((a) => a.id === id);
    if (index !== -1) {
      this.abonnements[index] = { ...this.abonnements[index], ...abonnement };
    }
  }

  delete(id: number) {
    this.abonnements = this.abonnements.filter((a) => a.id !== id);
  }
}
