import { Injectable } from '@angular/core';
export interface Local {
  id: number;
  taille: string;
  position: string;
  loyer: number;
  etat: string; // "libre" ou "occupé"
}
@Injectable({
  providedIn: 'root',
})
export class LocalService {
  constructor() {}
  private locaux: Local[] = [
    { id: 1, taille: '50m²', position: 'RDC-01', loyer: 500000, etat: 'libre' },
    {
      id: 2,
      taille: '30m²',
      position: 'RDC-02',
      loyer: 300000,
      etat: 'occupé',
    },
  ];

  getAll(): Local[] {
    return this.locaux;
  }

  getById(id: number): Local | undefined {
    return this.locaux.find((l) => l.id === id);
  }

  add(local: Omit<Local, 'id'>) {
    const newId = this.locaux.length
      ? Math.max(...this.locaux.map((l) => l.id)) + 1
      : 1;
    this.locaux.push({ ...local, id: newId });
  }

  update(id: number, local: Partial<Omit<Local, 'id'>>) {
    const index = this.locaux.findIndex((l) => l.id === id);
    if (index !== -1) {
      this.locaux[index] = { ...this.locaux[index], ...local };
    }
  }

  delete(id: number) {
    this.locaux = this.locaux.filter((l) => l.id !== id);
  }
}
