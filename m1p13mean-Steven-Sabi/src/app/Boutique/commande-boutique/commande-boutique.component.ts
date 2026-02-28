import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, CheckCircle, XCircle, List } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import {
  CommadeServiceBoutiqueService,
  Commande,
} from './commade-service-boutique.service';
@Component({
  selector: 'app-commande-boutique',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './commande-boutique.component.html',
  styleUrl: './commande-boutique.component.css',
})
export class CommandeBoutiqueComponent {
  commandes: any[] = [];
  users: any[] = [];
  produits: any[] = [];
  modalOuvertListe = false;
  commande: any = {};
  total = 0;

  // Icônes
  CheckCircleIcon = CheckCircle;
  XCircleIcon = XCircle;
  ListeIcon = List;

  constructor(private commandeService: CommadeServiceBoutiqueService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    forkJoin({
      users: this.commandeService.getAllUser(),
      produits: this.commandeService.getAllProduit(),
      commandes: this.commandeService.getAllCommande()
    }).subscribe({
      next: ({ users, produits, commandes }) => {
    
        // Toutes les requêtes sont terminées ici
        this.users = users;
        this.produits = produits;
        this.commandes = commandes;
    
        console.log("Tout est chargé !");
        // console.log(this.users);
        // console.log(this.produits);
        // console.log(this.commandes);
    
        // 👉 Ici tu peux faire ton traitement
        let theCommande: any = []
        theCommande = this.commandes.map((cmd:any) => {

          // Trouver le user correspondant
          const user = this.users.find(u => u._id === cmd.id_user);
          console.log(this.users, cmd.id_user)
      
          let qte = 0;
          // Associer les produits complets
          const produitsEnrichis = cmd.produits.map((p: any) => {
          const produitComplet = this.produits.find(prod => prod._id == p.id);
          const dernierPrix = produitComplet.prix?.[produitComplet.prix.length - 1]?.montant || 0;
          const total = Number(p.qte) * Number(dernierPrix);
            return {
              ...produitComplet,
              qte: p.qte,
              duree: p.duree,
              total: total,
              qteTotal: produitComplet.qte
            };
          });

          const totalCommande = produitsEnrichis.reduce((sum: number, p: any) => sum + p.total, 0);

          // Création de l'objet final avec total
          const commandeFinale = {
            ...cmd,
            produits: produitsEnrichis,
            total: totalCommande
          };
      
          // Retour objet fusionné
          return {
            ...cmd,
            user,
            produits: produitsEnrichis,
            total: totalCommande,
          
          };
        });

        // Total global de la commande

      
        this.commandes = theCommande;
        console.log(this.commandes);
      },
      error: (err) => {
        console.error("Erreur lors du chargement :", err);
      }
    });
    
  }

  valider(commande: any) {
    const commandeFinale = {
      statut: {
        id: "699ed38fd04a906cf6c917a6",
        libelle: "VALIDER"
      },
      _id: commande._id,
      id_user: commande.id_user,
      user: {
        id: commande.user._id,
        nom: commande.user.nom,
        prenom: commande.user.prenom,
        email: commande.user.email,
        contact: commande.user.contact
      },
      produits: commande.produits.map((p: any) => ({
        id: p._id || p.id,
        nom: p.label || p.nom,
        qte: p.qte,
        duree: p.duree
      })),
      date_creation: commande.date_creation,
      date_update: commande.date_update
    };
    console.log(commandeFinale)
    this.commandeService.updateCommande(commandeFinale).subscribe({
      next: (res) => {
        console.log('Commande update', res);
        this.load();
      },
      error: (err) => {
        console.error('Erreur updateCmd', err);
      }
    });
    commandeFinale.produits.map((p: any) => {
      const prod: any = {};
    
      prod.id_produit = p.id;
      prod.type = { id: "699ed01b6252ddafd44c125e", label: "SORTIE" };
    
      // Appel du service (si tu veux juste l'exécuter ici)
      this.commandeService.addStockOut(prod).subscribe({
        next: (res) => {
          console.log('Stock update', res);
          this.load();
        },
        error: (err) => {
          console.error('Erreur updateStock', err);
        }
      });
    
      return prod; // retourne l'objet pour le tableau produitFinal
    });


    commande.produits.map((p: any) => {
      const prod: any = p
      prod.qte = prod.qteTotal - prod.qte 
    
      // Appel du service (si tu veux juste l'exécuter ici)
      this.commandeService.updateProduit(prod).subscribe({
        next: (res) => {
          console.log('Produit update', res);
          this.load();
        },
        error: (err) => {
          console.error('Erreur updateProduit', err);
        }
      });
      
      return prod; // retourne l'objet pour le tableau produitFinal
    });
    console.log(commande, commandeFinale)
    this.load();
  }

  annuler(commande: any) {
    const commandeFinale = {
      statut: {
        id: "699ed398d04a906cf6c917a8",
        libelle: "ANNULER"
      },
      _id: commande._id,
      id_user: commande.id_user,
      user: {
        id: commande.user._id,
        nom: commande.user.nom,
        prenom: commande.user.prenom,
        email: commande.user.email,
        contact: commande.user.contact
      },
      produits: commande.produits.map((p: any) => ({
        id: p._id || p.id,
        nom: p.label || p.nom,
        qte: p.qte,
        duree: p.duree
      })),
      date_creation: commande.date_creation,
      date_update: commande.date_update
    };
    console.log(commandeFinale)
    this.commandeService.updateCommande(commandeFinale).subscribe({
      next: (res) => {
        console.log('Commande update', res);
        this.load();
      },
      error: (err) => {
        console.error('Erreur updateCmd', err);
      }
    });
    this.load();
  }

  voirProduit(commande:any){
    this.commande = commande;
    this.total = commande.produits.reduce((sum: number, produit: any) => {
      return sum + (Number(produit.qte) * Number(produit.prix[produit.prix.length-1].montant));
    }, 0);
    this.modalOuvertListe = true;
  }

  fermerModal(){
    this.modalOuvertListe = false;
  }
}
