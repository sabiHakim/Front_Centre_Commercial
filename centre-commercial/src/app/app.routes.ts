import { Routes } from '@angular/router';
import { AcceuilComponent } from './layout/acceuil/acceuil/acceuil.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { LoginComponent } from './auth/login/login.component';
export const routes: Routes = [
  { path: 'inscription', component: InscriptionComponent },
  { path: 'connexion', component: LoginComponent },
  { path: '', component: AcceuilComponent },
];
