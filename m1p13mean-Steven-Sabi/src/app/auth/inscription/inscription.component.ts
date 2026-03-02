import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../environnements/environment';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {
  user = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    contact: ''
  };

  isLoading = false;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: NgForm) {
    if (!form.valid || this.isLoading) return;

    this.isLoading = true;

    this.http.post(`${this.apiUrl}/users/create`, this.user)
      .subscribe({
        next: (res) => {
          alert('Inscription réussie !');
          form.resetForm();
          this.isLoading = false;
          this.router.navigate(['/connexion']);
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Erreur lors de l\'inscription');
          this.isLoading = false;
        }
      });
  }
}