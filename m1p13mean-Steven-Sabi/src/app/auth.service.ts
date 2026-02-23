// src/app/core/auth.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PanierService } from './service/panier/panier.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environnements/environment';
export interface Role {
  _id: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // getRoles
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/users/roles`);
  }
  private userSubject = new BehaviorSubject<AppUser | null>(null);
  user$ = this.userSubject.asObservable();

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  constructor(public panierService: PanierService) {}

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
  private mapRole(apiRole: any): UserRole {
    if (!apiRole) return null;

    switch (apiRole.label) {
      case 'ADMIN':
        return 'admin';
      case 'BOUTIQUE':
        return 'boutique';
      case 'CLIENT':
        return 'acheteur';
      default:
        return null;
    }
  }
  login(email: string, password: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .post<any>('http://localhost:3000/users/connexion', {
        email,
        password,
      })
      .subscribe({
        next: (res) => {
          const role = this.mapRole(res.role.label);

          const user: AppUser = {
            email: res.email,
            role,
          };

          this.userSubject.next(user);
          localStorage.setItem('token', res.token);
          localStorage.setItem('userEmail', res.email);
          localStorage.setItem('userRole', role);
          localStorage.setItem('isLoggedIn', 'true');

          this.redirectAfterLogin(role);
        },
        error: (err) => {
          alert(err.error?.message || 'Erreur de connexion');
        },
      });
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
    this.panierService.clearPanier(); // <-- ajoute ça

    // Redirection vers la page d'accueil
    this.router.navigate(['/']);
  }
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
      admin: '/admin/dashboard',
      boutique: '/boutique',
      acheteur: '/client',
    };
    const path = routes[role] || '/';
    this.router.navigate([path]);
  }
}
