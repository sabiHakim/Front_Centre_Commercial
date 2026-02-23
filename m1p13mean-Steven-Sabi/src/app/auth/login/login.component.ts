import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LucideAngularModule, Store, User, UserCog } from 'lucide-angular';
import { AuthService } from '../../auth.service';
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
  private auth = inject(AuthService);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  fillDemo(role: 'CLIENT' | 'BOUTIQUE' | 'ADMIN') {
    const demos = {
      CLIENT: { email: 'client@email.com', password: 'client' },
      BOUTIQUE: { email: 'boutique@email.com', password: 'boutique' },
      ADMIN: { email: 'admin@email.com', password: 'admin' },
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
      this.auth.login(email, password);
    }
  }
}
