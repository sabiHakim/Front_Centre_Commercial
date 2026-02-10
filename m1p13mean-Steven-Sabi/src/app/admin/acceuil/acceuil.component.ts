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
  stats: any;

  // 📅 Sélection période
  moisSelectionne = new Date().getMonth() + 1;
  anneeSelectionnee = new Date().getFullYear();

  // Icons
  StoreIcon = Store;
  CheckCircleIcon = CheckCircle;
  XCircleIcon = XCircle;
  PlusCircleIcon = DollarSign;

  ngOnInit() {
    this.boutiques = this.adminService.getBoutiques();
    this.refreshStats();
  }

  refreshStats() {
    this.stats = this.adminService.getStats(
      this.moisSelectionne,
      this.anneeSelectionnee
    );
  }

  payer(boutiqueId: number) {
    this.adminService.payerMois(
      boutiqueId,
      this.moisSelectionne,
      this.anneeSelectionnee
    );
    this.refreshStats();
  }

  estPaye(boutiqueId: number): boolean {
    return this.adminService.estPaye(
      boutiqueId,
      this.moisSelectionne,
      this.anneeSelectionnee
    );
  }
}
