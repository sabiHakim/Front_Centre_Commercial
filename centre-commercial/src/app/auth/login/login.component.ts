import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Store, User, UserCog } from 'lucide-angular';
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  protected readonly UserIcon = User;
  protected readonly StoreIcon = Store;
  protected readonly UserCogIcon = UserCog;
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  fillDemo(role: 'acheteur' | 'boutique' | 'admin') {
    const demos = {
      acheteur: { email: 'acheteur@demo.com', password: 'demo123' },
      boutique: { email: 'boutique@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'admin456' },
    };

    const creds = demos[role];
    this.loginForm.patchValue({
      email: creds.email,
      password: creds.password,
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log(`Connexion avec ${email} / ${password}`);

      // Simulation : redirection selon rôle (à remplacer par appel API réel)
      const roleFromEmail = email.includes('admin')
        ? 'admin'
        : email.includes('boutique')
          ? 'boutique'
          : 'acheteur';

      // Stocke rôle (exemple simplifié)
      localStorage.setItem('userRole', roleFromEmail);
      localStorage.setItem('isLoggedIn', 'true');
      // Redirection selon rôle
      if (roleFromEmail === 'admin') {
        this.router.navigate(['/connexion']);
      } else if (roleFromEmail === 'boutique') {
        this.router.navigate(['/connexion']);
      } else {
        this.router.navigate(['/connexion']);
      }
    }
  }
}
