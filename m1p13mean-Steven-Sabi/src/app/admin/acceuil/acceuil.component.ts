import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Store,
  CheckCircle,
  XCircle,
  DollarSign ,
} from 'lucide-angular';
import { ServiceAdminService } from '../service-admin.service';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-acceuil',
  standalone: true,
  imports: [CommonModule, LucideAngularModule,FormsModule],
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.css',
})


export class AcceuilComponentAdmin implements OnInit {
 constructor(private adminService: ServiceAdminService) {}

  boutiques: any[] = [];
  loyers: any[] = [];
  stats: any;

  // 📅 Sélection période
  moisSelectionne = new Date().getMonth() + 1;
  anneeSelectionnee = new Date().getFullYear();

  boutiqueTotal = 0;
  paye = 0;
  nonPaye = 0;
  revenue = 0;

  // Icons
  StoreIcon = Store;
  CheckCircleIcon = CheckCircle;
  XCircleIcon = XCircle;
  PlusCircleIcon = DollarSign;


ngOnInit() {

  forkJoin({
    boutiques: this.adminService.getAllBoutiques(),
    loyers: this.adminService.getAllLoyer()
  }).subscribe(({ boutiques, loyers }) => {

    // console.log(this.loyers, this.boutiques)
    this.loyers = loyers;
    this.paye = 0;
    this.nonPaye = 0;
    this.revenue = 0;

    this.boutiques = boutiques.map((boutique: any) => {

      // 🔹 Filtrer par boutique + mois + année
      const loyersFiltres = this.loyers.filter((l: any) =>
        l.id_boutique === boutique._id &&
        l.mois === Number(this.moisSelectionne) &&
        l.annee === Number(this.anneeSelectionnee)
      );

      // 🔹 Montant total à payer
      const date = new Date(Number(this.anneeSelectionnee), Number(this.moisSelectionne) - 1, Number(31));
      const theLocal = boutique.local;
      // console.log(boutique.local)
      const local = theLocal.filter((b: any) => {
        const dateCreation = new Date(b.date);
        // console.log(dateCreation.getTime(), date.getTime());
        return dateCreation.getTime() < date.getTime();
      });

      
      let montantTotal = theLocal[0].loyer;
      if(local.length>0){
        // console.log(local[local.length-1].loyer)
        montantTotal = local[local.length-1].loyer;
      }

      if (loyersFiltres.length > 0) {
        montantTotal = loyersFiltres[0].montant;
      }

      // 🔹 Montant déjà payé
      const montantPaye = loyersFiltres.reduce(
        (sum: number, l: any) => sum + Number(l.montant_payer || 0),
        0
      );

      // 🔹 Reste à payer
      const reste = montantTotal - montantPaye;

      if(reste > 0){
        this.nonPaye = this.nonPaye+1
      }
      if(reste === 0){
        this.paye = this.paye+1
      }
      this.revenue = this.revenue + montantPaye

      return {
        ...boutique,
        montantTotal,
        montantPaye,
        reste
      };
    });
    this.getOtherData()
  });

}

  getData(){
    // console.log(this.loyers, this.boutiques)
    this.loyers = this.loyers;
    this.paye = 0;
    this.nonPaye = 0;
    this.revenue = 0;

    this.boutiques = this.boutiques.map((boutique: any) => {

      // 🔹 Filtrer par boutique + mois + année
      const loyersFiltres = this.loyers.filter((l: any) =>
        l.id_boutique === boutique._id &&
        l.mois === Number(this.moisSelectionne) &&
        l.annee === Number(this.anneeSelectionnee)
      );

      // 🔹 Montant total à payer
      const date = new Date(Number(this.anneeSelectionnee), Number(this.moisSelectionne) - 1, Number(31));
      const theLocal = boutique.local;
      // console.log(boutique.local)
      const local = theLocal.filter((b: any) => {
        const dateCreation = new Date(b.date);
        // console.log(dateCreation.getTime(), date.getTime());
        return dateCreation.getTime() < date.getTime();
      });

      
      let montantTotal = theLocal[0].loyer;
      if(local.length>0){
        // console.log(local[local.length-1].loyer)
        montantTotal = local[local.length-1].loyer;
      }

      if (loyersFiltres.length > 0) {
        montantTotal = loyersFiltres[0].montant;
      }

      // 🔹 Montant déjà payé
      const montantPaye = loyersFiltres.reduce(
        (sum: number, l: any) => sum + Number(l.montant_payer || 0),
        0
      );

      // 🔹 Reste à payer
      const reste = montantTotal - montantPaye;

      if(reste > 0){
        this.nonPaye = this.nonPaye+1
      }
      if(reste === 0){
        this.paye = this.paye+1
      }
      this.revenue = this.revenue + montantPaye

      return {
        ...boutique,
        montantTotal,
        montantPaye,
        reste
      };
    });
    this.getOtherData()
  }

  refreshStats() {
    this.getData()
    this.getOtherData();
  }

  getOtherData(){
    const date = new Date(Number(this.anneeSelectionnee), Number(this.moisSelectionne) - 1, Number(31));
    const boutique = this.boutiques.filter((b: any) => {
      const dateCreation = new Date(b.date_creation);
      // console.log(dateCreation.getTime(), date.getTime());
      return dateCreation.getTime() < date.getTime();
    });
    // console.log(boutique)
    this.boutiqueTotal = boutique.length;
    if(boutique.length===0){
      this.boutiqueTotal = this.boutiques.length
    }






  }

  payer(boutiqueId: number) {
    this.adminService.payerMois(
      boutiqueId,
      this.moisSelectionne,
      this.anneeSelectionnee
    );
    this.refreshStats();
  }

  estPaye(rest: string): boolean {
    // console.log(rest)
    if(rest == "0"){
      return true
    }
    return false
  }
}
