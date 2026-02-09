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
} from 'lucide-angular';
import { ServiceAdminService } from '../service-admin.service';

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

  boutiques: any[] = [];
  
  constructor(private service: ServiceAdminService) {}

  ngOnInit() {
    this.boutiques = this.service.getBoutiques();
  }

  // ======= Modal unique =======
  modalOuvert: boolean = false;
  mode: 'ajout' | 'edition' = 'ajout';
  boutiqueForm: any = this.getBoutiqueVide();

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
