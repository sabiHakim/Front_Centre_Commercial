import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Store, User, UserCog } from 'lucide-angular';
@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css',
})
export class InscriptionComponent {
  selectedRole: 'acheteur' | 'boutique' | 'admin' = 'acheteur';
  protected readonly UserIcon = User;
  protected readonly StoreIcon = Store;
  protected readonly UserCogIcon = UserCog;
  onSubmit() {
    // Ici tu mettras plus tard la logique d'inscription (appel API, validation, etc.)
    console.log('Inscription pour rôle :', this.selectedRole);
    // Exemple : if (this.selectedRole === 'admin') { ... }
  }
}
