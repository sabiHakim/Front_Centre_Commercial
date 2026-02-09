import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  boutiques = [
    { id: 1, nom: 'Fashion Store' },
    { id: 2, nom: 'Tech World' },
    { id: 3, nom: 'Food Market' },
  ];

  produits = [
    {
      id: 1,
      nom: 'T-shirt Nike',
      prix: 45000,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      description: 'T-shirt confortable en coton',
      boutiqueId: 1,
      stock: 2
    },
    {
      id: 2,
      nom: 'Jean Slim',
      prix: 80000,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
      description: 'Jean slim moderne',
      boutiqueId: 1,
      stock: 3,
    },
    {
      id: 3,
      nom: 'Laptop HP',
      prix: 2500000,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      description: 'PC portable performant',
      boutiqueId: 2,
      stock: 4,
    },
    {
      id: 4,
      nom: 'Smartphone Samsung',
      prix: 1800000,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
      description: 'Téléphone Android dernière génération',
      boutiqueId: 2,
      stock: 4,
    },
    {
      id: 5,
      nom: 'Pizza Fromage',
      prix: 15000,
      image:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
      description: 'Pizza chaude et savoureuse',
      boutiqueId: 3,
      stock: 6,
    },
  ];

  constructor() {}
  getBoutiques() {
    return this.boutiques;
  }

  getProduits() {
    return this.produits;
  }

  getProduitsParBoutique(boutiqueId: number) {
    return this.produits.filter((p) => p.boutiqueId === boutiqueId);
  }
}
