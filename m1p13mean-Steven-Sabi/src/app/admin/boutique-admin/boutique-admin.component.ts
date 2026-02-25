import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Store,
  PlusCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  PlayCircle,
  PauseCircle,
  DollarSign
} from 'lucide-angular';
import { ServiceAdminService, Loyer } from '../service-admin.service';

@Component({
  selector: 'app-boutique-admin',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './boutique-admin.component.html',
  styleUrl: './boutique-admin.component.css',
})
export class BoutiqueAdminComponent implements OnInit {
  // Icônes
  StoreIcon = Store;
  PlusCircleIcon = PlusCircle;
  CheckCircleIcon = CheckCircle;
  XCircleIcon = XCircle;
  EditIcon = Edit;
  TrashIcon = Trash;
  PlayCircleIcon = PlayCircle;
  PauseCircleIcon = PauseCircle;
  DollarSignIcon = DollarSign;
  
  constructor(private service: ServiceAdminService) {}

  boutiques: any[] = [];


  ngOnInit() {
    this.service.getAllBoutiques().subscribe((res) => {
      this.boutiques = res;
    });
  }

  // ======= Modal unique =======
  modalOuvert: boolean = false;
  mode: 'ajout' | 'loyer' | 'edition' = 'ajout';
  boutiqueForm: any = this.getBoutiqueVide();
  loyerRestant : number = 0;
  payer : number = 0;

  updateLoyerRestant() {
    if (!this.boutiqueForm.mois || !this.boutiqueForm.annee) {
      this.loyerRestant = this.boutiqueForm.local?.length
        ? this.boutiqueForm.local[this.boutiqueForm.local.length - 1]?.loyer
        : 0;
      this.payer = 0
      return;
    }
    console.log(this.boutiqueForm)
  
    this.service.getAllLoyer().subscribe((res: any[]) => {
      const filtre = res.filter(
        (p) =>
          p.id_boutique === this.boutiqueForm._id &&
          p.mois === Number(this.boutiqueForm.mois) &&
          p.annee === Number(this.boutiqueForm.annee)
      );
      
      console.log(res, filtre)
      if (filtre.length > 0) {
        const total = filtre[0].montant;
        const payer = filtre.reduce((sum, p) => sum + (p.montant_payer || 0), 0);
        this.payer = payer;
        this.loyerRestant = total - payer;
      } else {
        // Si aucun paiement trouvé, afficher le loyer du dernier local
        this.loyerRestant = this.boutiqueForm.local?.length
          ? this.boutiqueForm.local[this.boutiqueForm.local.length - 1]?.loyer
          : 0;
        this.payer = 0
      }
    });
  }

  isPaiementValide(): boolean {
    // console.log('ici', this.boutiqueForm.montant, this.loyerRestant);
    return (
      this.boutiqueForm.montant > 0 &&
      this.boutiqueForm.montant <= this.loyerRestant
    );
  }

  ouvrirModalLoyer(b: any) {
    this.mode = 'loyer';
    this.boutiqueForm = { ...b };
    console.log(this.boutiqueForm)
    // Valeurs par défaut
    this.boutiqueForm.mois = 1;     // Janvier
    this.boutiqueForm.annee = 2025; // 2025
    this.updateLoyerRestant();
    this.modalOuvert = true;
  }

  payeLoyer(){
    const loyer: any = {};
    loyer.id_boutique = this.boutiqueForm._id;
    loyer.boutique = this.boutiqueForm;
    loyer.boutique.id = this.boutiqueForm._id;
    loyer.montant = this.payer + this.loyerRestant;
    loyer.mois = Number(this.boutiqueForm.mois);
    loyer.annee = Number(this.boutiqueForm.annee);
    loyer.montant_payer = this.boutiqueForm.montant;

    console.log(loyer);

    this.service.createLoyer(loyer).subscribe({
      next: (res) => {
        console.log('Loyer créé', res);
        this.fermerModal();
      },
      error: (err) => {
        console.error('Erreur création', err);
      }
    });

  }


  ouvrirModalAjout() {
    this.mode = 'ajout';
    this.boutiqueForm = this.getBoutiqueVide();
    this.modalOuvert = true;
  }

  ouvrirModalEdition(b: any) {
    this.mode = 'edition';
    this.boutiqueForm = { ...b };
    this.modalOuvert = true;
  }

  fermerModal() {
    this.modalOuvert = false;
    this.boutiqueForm = this.getBoutiqueVide();
  }

  confirmer() {
    if (this.mode === 'ajout') {
      const idMax = this.boutiques.length
        ? Math.max(...this.boutiques.map((b) => b.id))
        : 0;
      this.boutiques.push({ ...this.boutiqueForm, id: idMax + 1 });
    } else if (this.mode === 'edition') {
      const index = this.boutiques.findIndex(b => b.id === this.boutiqueForm.id);
      if (index > -1) this.boutiques[index] = { ...this.boutiqueForm };
    }
    this.fermerModal();
  }

  getBoutiqueVide() {
    return {
      nom: '',
      proprietaire: '',
      email: '',
      produits: 0,
      actif: true,
      logo: '',
      createdAt: new Date().toISOString().split('T')[0],
    };
  }

  // ======= Actions =======
  toggle(id: number) {
    this.service.toggleStatus(id);
  }

  delete(id: number) {
    if (confirm('Supprimer cette boutique ?')) {
      this.service.delete(id);
      this.boutiques = this.service.getBoutiques();
    }
  }
}
