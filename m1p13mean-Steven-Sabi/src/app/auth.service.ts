import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PanierService } from './service/panier/panier.service';
import { environment } from '../environnements/environment';

export type UserRole = 'CLIENT' | 'BOUTIQUE' | 'ADMIN' | null;

export interface AppUser {
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  status: number;
  user: {
    _id: number;
    email: string;
    role: {
      id: number;
      label: 'ADMIN' | 'BOUTIQUE' | 'ACHETEUR';
    };
  };
  token: string;
}

@Injectable({providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private apiUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<AppUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(public panierService: PanierService) {}

  // ─────────────────────────────
  // LOGIN
  // ─────────────────────────────
  login(email: string, password: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .subscribe({
        next: (res) => {
          const user: AppUser = {
            email: res.user.email,
            role: res.user.role.label as UserRole,
          };
          this.userSubject.next(user);
          // Sauvegarde dans le localStorage
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userRole', user.role ?? '');
          localStorage.setItem('isLoggedIn', 'true');

          this.redirectAfterLogin(user.role!);
        },
        error: (err) => {
          if (err.status === 401) alert('Email ou mot de passe incorrect');
          else alert('Erreur serveur');
        },
      });
  }

  // ─────────────────────────────
  // INIT AUTH
  // ─────────────────────────────
  initAuth(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user: AppUser = JSON.parse(savedUser);
        this.userSubject.next(user);
      } catch (e) {
        console.error('Erreur lors de la récupération du user depuis localStorage', e);
        localStorage.removeItem('user');
      }
    }
  }

  // ─────────────────────────────
  // LOGOUT
  // ─────────────────────────────
  logout(): void {
    this.userSubject.next(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.panierService.clearPanier();
    this.router.navigate(['/']);
  }

  // ─────────────────────────────
  // GETTERS
  // ─────────────────────────────
  get currentUser(): AppUser | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  // ─────────────────────────────
  // REDIRECTION APRÈS LOGIN
  // ─────────────────────────────
  private redirectAfterLogin(role: Exclude<UserRole, null>): void {
    const routes: Record<Exclude<UserRole, null>, string> = {
      ADMIN: '/admin/dashboard',
      BOUTIQUE: '/boutique',
      CLIENT: '/client',
    };
    this.router.navigate([routes[role]]);
  }
}