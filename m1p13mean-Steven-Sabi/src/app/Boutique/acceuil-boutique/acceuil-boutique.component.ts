import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Edit, Trash, Package, AlertCircle, CheckCircle, Box, ShoppingCart, CreditCard, Loader } from 'lucide-angular';
import { OnDestroy } from '@angular/core';
import { ServiceBoutiqueService, Commande } from '../service-boutique.service';
@Component({
  selector: 'app-acceuil-boutique',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './acceuil-boutique.component.html',
  styleUrl: './acceuil-boutique.component.css',
})
export class AcceuilBoutiqueComponent implements OnInit {
  BoxIcon = Box;
  PackageIcon = Package;
  ShoppingCartIcon = ShoppingCart;
  CreditCardIcon = CreditCard;
  EditIcon = Edit;
  TrashIcon = Trash;
  constructor(private boutiqueService: ServiceBoutiqueService) {}

  produits:any = [];
  commandes:any = [];
  boutiques:any = [];
  currentUser:any = {};
  myBoutique:any = [];
  myProduit:any = [];
  myCommande:any = [];
  myUser:any = [];
  currentBoutique:any = {};
  user:any = {};
  modalOuvert = false;
  loading: boolean = false;

  ngOnInit(): void {
    
    const userData = localStorage.getItem('user');

if (!userData) {
  this.user = null;
  return; // stop si pas connecté
}

this.user = JSON.parse(userData);
const emailCherche = this.user.email?.toLowerCase().trim();

/* ===================== USERS ===================== */

this.boutiqueService.getAllUser().subscribe((users: any[]) => {

  this.myUser = users.filter(c =>
    c.email?.toLowerCase().trim() === emailCherche
  );

  if (!this.myUser.length) return;

  this.currentUser = this.myUser[0];
  console.log("CurrentUser:", this.currentUser);

  /* ===================== COMMANDES ===================== */

  this.boutiqueService.getAllCommande().subscribe((commandes: any[]) => {

    this.myCommande = commandes.filter(c =>
      c.id_user === this.currentUser._id   // ✅ === au lieu de =
    );

    console.log("Mes commandes:", this.myCommande);
  });

});


/* ===================== BOUTIQUES ===================== */

this.boutiqueService.getAllBoutique().subscribe((boutiques: any[]) => {

  this.myBoutique = boutiques.filter(b =>
    Array.isArray(b.users) &&
    b.users.some((u: any) =>
      u.email?.toLowerCase().trim() === emailCherche
    )
  );

  if (!this.myBoutique.length) return;

  this.currentBoutique = this.myBoutique[0];
  console.log("CurrentBoutique:", this.currentBoutique);

  /* ===================== PRODUITS ===================== */

  this.boutiqueService.getAllProduit().subscribe((produits: any[]) => {

    this.myProduit = produits.filter(p =>
      p.id_boutique === this.currentBoutique._id  // ✅ === au lieu de =
    );

    console.log("Mes produits:", this.myProduit);
  });

});
  }



  ouvrirModal(){
    this.modalOuvert = true
  }


  fermerModal(){
    this.modalOuvert = false
  }

  setCurrentBoutique(boutique: any){
    this.currentBoutique = boutique
  }

  editBoutique() {
    if (this.selectedFileLogo) {
      this.loading = true; // début du chargement
  
      const formDataLogo = new FormData();
      formDataLogo.append('file', this.selectedFileLogo); 
      this.fermerModal();
      this.boutiqueService.upload(formDataLogo).subscribe({
        next: (resLogo) => {
          console.log('Upload logo', resLogo);
          this.currentBoutique.logo = resLogo.url;
  
          if (this.selectedFileFond) {
            const formDataFond = new FormData();
            formDataFond.append('file', this.selectedFileFond); 
  
            this.boutiqueService.upload(formDataFond).subscribe({
              next: (resFond) => {
                console.log('Upload fond', resFond);
                this.currentBoutique.fond = resFond.url;
  
                console.log(this.currentBoutique)
                // Mise à jour de la boutique après uploads
                this.boutiqueService.updateBoutique(this.currentBoutique).subscribe({
                  next: (res) => {
                    console.log('Update Boutique', res);
                    this.loading = false; // fin du chargement
                    this.fermerModal(); // fermer modal après succès
                  },
                  error: (err) => {
                    console.error('Erreur update Boutique', err);
                    this.loading = false;
                  }
                });
              },
              error: (err) => {
                console.error('Upload fond erreur', err);
                this.loading = false;
              }
            });
          } else {
            // Si pas de fond, juste update logo
            this.boutiqueService.updateBoutique(this.currentBoutique).subscribe({
              next: (res) => {
                console.log('Update Boutique', res);
                this.loading = false;
                this.fermerModal();
              },
              error: (err) => {
                console.error('Erreur update Boutique', err);
                this.loading = false;
              }
            });
          }
        },
        error: (err) => {
          console.error('Upload logo erreur', err);
          this.loading = false;
        }
      });
  
    } else {
      console.log("Aucun fichier sélectionné !");
      this.loading = true;
      this.boutiqueService.updateBoutique(this.currentBoutique).subscribe({
        next: (res) => {
          console.log('Update boutique', res);
          this.loading = false;
          this.fermerModal();
        },
        error: (err) => {
          console.error('Erreur update boutique', err);
          this.loading = false;
        }
      });
    }
  }


  selectedFileLogo: File | null = null;
  onFileSelectedLogo(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileLogo = file;
      console.log("Fichier sélectionné:", file);
    }
  }

  selectedFileFond: File | null = null;
  onFileSelectedFont(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileFond = file;
      console.log("Fichier sélectionné:", file);
    }
  }

  
}
