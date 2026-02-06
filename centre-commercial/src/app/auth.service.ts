// src/app/core/auth.service.ts   (ou src/app/auth.service.ts)
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { PanierService } from './service/panier/panier.service';

export type UserRole = 'acheteur' | 'boutique' | 'admin' | null;

export interface AppUser {
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<AppUser | null>(null);
  user$ = this.userSubject.asObservable();

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  constructor(public panierService:PanierService) {}

  initAuth(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const savedRole = localStorage.getItem('userRole') as UserRole | null;
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail && savedRole !== null) {
      this.userSubject.next({ email: savedEmail, role: savedRole });
    }
  }
  /**
   * Connexion avec vérification email + mot de passe (simulation démo)
   */
  login(email: string, password: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Liste des utilisateurs de démonstration
    const demoUsers: Record<string, { password: string; role: Exclude<UserRole, null> }> = {
      'acheteur@demo.com': {
        password: 'demo123',
        role: 'acheteur',
      },
      'boutique@demo.com': {
        password: 'demo123',
        role: 'boutique',
      },
      'admin@demo.com': {
        password: 'admin456',
        role: 'admin',
      },
    };

    const normalizedEmail = email.trim().toLowerCase();
    const userData = demoUsers[normalizedEmail];

    if (!userData) {
      alert('Email non reconnu.');
      return;
    }

    if (userData.password !== password) {
      alert('Mot de passe incorrect.');
      return;
    }

    const user: AppUser = {
      email: normalizedEmail,
      role: userData.role,
    };

    this.userSubject.next(user);

    // Sauvegarde
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userEmail', normalizedEmail);
    localStorage.setItem('isLoggedIn', 'true');

    this.redirectAfterLogin(userData.role);
  }

  /**
   * Déconnexion complète
   */
logout(): void {
  // Réinitialise l'état utilisateur
  this.userSubject.next(null);

  if (isPlatformBrowser(this.platformId)) {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('panier');
  }

  // 🔹 Réinitialiser le panier dans le service
  this.panierService.clearPanier();  // <-- ajoute ça

  // Redirection vers la page d'accueil
  this.router.navigate(['/']);
}
//   logout(): void {
//   this.userSubject.next(null);

//   if (isPlatformBrowser(this.platformId)) {
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('userEmail');
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('panier');
//   }

//   this.router.navigateByUrl('/').then(() => {
//     window.location.reload();
//   });
// }
  // ────────────────────────────────────────────────
  // Getters utiles
  // ────────────────────────────────────────────────
  get currentUser(): AppUser | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  // ────────────────────────────────────────────────
  // Redirection privée
  // ────────────────────────────────────────────────

  private redirectAfterLogin(role: Exclude<UserRole, null>): void {
    const routes: Record<Exclude<UserRole, null>, string> = {
      admin:    '/admin/dashboard',
      boutique: '/boutique',
      acheteur: '/client',
    };
    const path = routes[role] || '/';
    this.router.navigate([path]);
  }
}