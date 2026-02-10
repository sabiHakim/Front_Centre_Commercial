import { Routes } from '@angular/router';
import { AcceuilComponent } from './layout/acceuil/acceuil/acceuil.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { LoginComponent } from './auth/login/login.component';
import { ClientComponent } from './Client/client/client.component';
import { PanierComponent } from './panier/panier/panier.component';
import { AcceuilComponentAdmin } from './admin/acceuil/acceuil.component';
import { AcceuilBoutiqueComponent } from './Boutique/acceuil-boutique/acceuil-boutique.component';
import { ProduitBoutiqueComponent } from './Boutique/produit-boutique/produit-boutique.component';
import { BoutiqueAdminComponent } from './admin/boutique-admin/boutique-admin.component';
import { LoyerBoutiqueComponent } from './Boutique/loyer-boutique/loyer-boutique.component';

export const routes: Routes = [
  { path: 'inscription', component: InscriptionComponent },
  { path: 'connexion', component: LoginComponent },
  // client
  { path: 'client', component: ClientComponent },
  { path: 'panier', component: PanierComponent },
  // admin
  { path: 'admin/dashboard', component: AcceuilComponentAdmin },
  { path: 'admin/boutiques', component: BoutiqueAdminComponent },
  
  // boutique
  { path: 'boutique', component: AcceuilBoutiqueComponent },
  { path: 'boutique/produits', component: ProduitBoutiqueComponent },
  { path: 'boutique/loyers', component: LoyerBoutiqueComponent },
  
  { path: '', component: AcceuilComponent },
];
