import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceBoutiqueService, Produit } from '../service-boutique.service';
import { LucideAngularModule, Edit, Trash, Package, AlertCircle, CheckCircle, DollarSign } from 'lucide-angular';
import { OnDestroy } from '@angular/core';
import { first } from 'rxjs';
import { Console } from 'console';
@Component({
  selector: 'app-loyer-boutique',
  standalone: true,
  imports: [LucideAngularModule,CommonModule, FormsModule],
  templateUrl: './loyer-boutique.component.html',
  styleUrl: './loyer-boutique.component.css',
})

export class LoyerBoutiqueComponent implements OnInit {
  constructor(private boutiqueService: ServiceBoutiqueService) {}
  PlusCircleIcon = DollarSign;
  EditIcon = Edit;


  boutique = {
    id: 1,
    nom: 'Tech World',
    loyer: 500000,
    paiements: [
      { mois: 1, annee: 2026, paye: true },
      { mois: 2, annee: 2026, paye: false },
    ],
  };
  annee = "2025";
  // mois = [
  //   'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  //   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  // ];

  loyer: any = []
  currentUser:any = {}
  currentBoutique:any = {}
  myBoutique:any = []
  modaleLocal = false;
  modaleAbonnement = false;
  localForm:any = {};
  abonnementForm:any = {};
  localListModal: any = [];
  abonnementListModal: any = [];

  allLocal:any = [];
  selectedLocal:any = {}
  selectedLocalId: string = '';

  allAbonnement:any = [];
  selectedAbonnement:any = {}
  selectedAbonnementId: string = '';

  mois:any[] = [
    { id: 1, nom: "Janvier" },
    { id: 2, nom: "Février" },
    { id: 3, nom: "Mars" },
    { id: 4, nom: "Avril" },
    { id: 5, nom: "Mai" },
    { id: 6, nom: "Juin" },
    { id: 7, nom: "Juillet" },
    { id: 8, nom: "Août" },
    { id: 9, nom: "Septembre" },
    { id: 10, nom: "Octobre" },
    { id: 11, nom: "Novembre" },
    { id: 12, nom: "Décembre" }
  ];

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
        if (userData) {
          this.currentUser = JSON.parse(userData);
        } else {
          this.currentUser = null;
        };
        console.log(this.currentUser)
        const emailCherche = this.currentUser.email;

    let allBoutique:any[] = [];

    this.boutiqueService.getAllBoutique().subscribe({
      next: (data: any[]) => {
        allBoutique = data
      }
    });
    this.boutiqueService.getAllBoutique().subscribe((boutiques: any[]) => {
      this.myBoutique = boutiques.filter(b =>
        Array.isArray(b.users) &&
        b.users.some((u: any) =>
          u.email?.toLowerCase().trim() === emailCherche.toLowerCase().trim()
        )
      );
      // console.log(this.myBoutique);
      this.currentBoutique = this.myBoutique[0]
      this.boutiqueService.getAllLoyer().subscribe({
        next: (data: any[]) => {
          
          const resultat = Object.values(
            data.reduce((acc: any, item: any) => {
          
              const key = `${item.id_boutique}-${item.annee}-${item.mois}`;
          
              if (!acc[key]) {
                acc[key] = {
                  id_boutique: item.id_boutique,
                  boutique: item.boutique,
                  annee: item.annee,
                  mois: item.mois,
                  montant: item.montant,
                  montant_payer: 0
                };
              }
          
              acc[key].montant_payer += Number(item.montant_payer);
          
              return acc;
          
            }, {})
          );
          
          console.log(this.annee)
          this.loyer = this.getMontantParMois(resultat, this.annee, this.currentBoutique._id)
          console.log(this.loyer);
          // console.log(resultat);
        }
      })
    });



    
  }

  setCurrentBoutique(boutique: any){
    this.currentBoutique = boutique
  }


  getMontantParMois(data: any[], annee: string, id_boutique: string) {

    const moisList = Array.from({ length: 12 }, (_, i) => i + 1);
    const last:any  = data[data.length-1];
  
    return moisList.map((mois) => {
  
      // Filtrer les données pour cette année + boutique + mois
      const items = data.filter(item =>
        item.annee === Number(annee) &&
        item.id_boutique === id_boutique &&
        item.mois === mois
      );
  
      // Somme montant_payer
      const montant_total = items.reduce((sum, item) =>
        sum + Number(item.montant_payer || 0), 0
      );
  
      // Prendre le premier élément pour récupérer boutique/montant
      let etat = "Non payé";
      if(montant_total>0){
        etat = "En cours"
      }
      if(montant_total === last.montant){
        etat = "Payé"
      }
      
      
  
      // console.log(items, last)
      return {
        id_boutique: id_boutique,
        boutique: last?.boutique || null,
        annee: annee,
        mois: this.mois[mois-1],
        montant: last?.montant || 0,
        montant_total: montant_total,
        etat : etat
        
      };
    });
  }

  changeAnnee(){
    console.log(this.annee)
    this.ngOnInit();
  }

  local(){
    this.modaleLocal = true
    console.log(this.currentBoutique)
    this.localListModal = this.currentBoutique.local
    this.boutiqueService.getAllLocal().subscribe({
      next: (data: any[]) => {
        this.allLocal = data
      }
    });
    console.log(this.allLocal)
    this.selectedLocal = this.allLocal[0];
    console.log()
  }

  onSelectLocal() {
    console.log(this.selectedLocalId)
    const local = this.allLocal?.find((l: any) => l._id === this.selectedLocalId);
    if (local) {
      console.log('Local sélectionné :', local);
    } else {
      console.log('Aucun local sélectionné pour le moment');
    }
    this.selectedLocal = local;
    console.log('Local sélectionné :', local);
  }

  actionLocal(){
    this.boutiqueService.getAllUser().subscribe((users: any[]) => {
      const theUser = users.find(u => u.email === this.currentUser.email);
      if (theUser) {
        // console.log('Utilisateur :', theUser);
        // console.log('boutique :', this.currentBoutique);
        // console.log('local :', this.selectedLocal);
        const demande : any = {};
        demande.user = theUser;
        demande.user.id_user = theUser._id;
        demande.boutique = this.currentBoutique;
        demande.boutique.id = this.currentBoutique._id;
        demande.local = this.selectedLocal
        demande.local.id = this.selectedLocal._id;
        demande.statut = "EN_ATTENTE"
        console.log(demande)
        this.boutiqueService.createDemandeLocal(demande).subscribe({
          next: (res) => {
            console.log('Add demande local', res);
          },
          error: (err) => {
            console.error('Erreur add demande local', err);
          }
        });

      } else {
        console.log('Aucun utilisateur trouvé');
      }
    });
    this.fermerModal();
  }

  abonnement(){
    this.modaleAbonnement = true
    console.log(this.currentBoutique)
    this.abonnementListModal = this.currentBoutique.abonnement
    this.boutiqueService.getAllAbonnement().subscribe({
      next: (data: any[]) => {
        this.allAbonnement = data
      }
    });
    console.log(this.allAbonnement)
    this.selectedAbonnement = this.allAbonnement[0];
    console.log()
  }

  onSelectAbonnement() {
    console.log(this.selectedAbonnementId)
    const abonnement = this.allAbonnement?.find((l: any) => l._id === this.selectedAbonnementId);
    if (abonnement) {
      console.log('abonnement sélectionné :', abonnement);
    } else {
      console.log('Aucun abonnement sélectionné pour le moment');
    }
    this.selectedAbonnement = abonnement;
    console.log('abonnement sélectionné :', abonnement);
  }



  actionAbonnement(){
    this.boutiqueService.getAllUser().subscribe((users: any[]) => {
      const theUser = users.find(u => u.email === this.currentUser.email);
      if (theUser) {
        // console.log('Utilisateur :', theUser);
        // console.log('boutique :', this.currentBoutique);
        // console.log('local :', this.selectedLocal);
        const demande : any = {};
        demande.user = theUser;
        demande.user.id_user = theUser._id;
        demande.boutique = this.currentBoutique;
        demande.boutique.id = this.currentBoutique._id;
        demande.abonnement = this.selectedAbonnement
        demande.abonnement.id = this.selectedAbonnement._id;
        demande.statut = "EN_ATTENTE"
        console.log(demande)
        this.boutiqueService.createDemandeAbonnement(demande).subscribe({
          next: (res) => {
            console.log('Add demande abonnement', res);
          },
          error: (err) => {
            console.error('Erreur add demande abonnement', err);
          }
        });

      } else {
        console.log('Aucun utilisateur trouvé');
      }
    });
    this.fermerModal();
  }

  fermerModal(){
    this.modaleAbonnement = false;
    this.modaleLocal = false;
  }

}
