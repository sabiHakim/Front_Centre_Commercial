import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbonnementService, Abonnement } from './abonnement.service';
import { Edit2, PlusCircle, Trash2, LucideAngularModule, List, XCircleIcon,CheckCircleIcon  } from 'lucide-angular';
@Component({
  selector: 'app-abonnement',
  standalone: true,
  imports: [FormsModule, CommonModule, LucideAngularModule],
  templateUrl: './abonnement.component.html',
  styleUrl: './abonnement.component.css',
})
export class AbonnementComponent implements OnInit {
  Edit2 = Edit2;
  EditIcon = Edit2;
  Trash2 = Trash2;
  PlusCircleIcon = PlusCircle;
  XCircleIcon = XCircleIcon;
  ListIcon = List
  CheckCircleIcon = CheckCircleIcon


  abonnements:any[] = [];
  label = '';
  montant = 0;
  description = '';
  prioriter = 1;
  duree = "10"
  date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  editId: number | null = null;
  modalOuvert: boolean = false;
  modalOuvertListe: boolean = false;
  mode: 'add' | 'edit' = 'add';
  abonnementForm: any = {};
  abonnementDemande: any[] = [];

  constructor(private abonnementService: AbonnementService) {}
  ngOnInit() {
    this.load();
  }

  load() {
    this.abonnementService.getAllAbonnement().subscribe((res) => {
      this.abonnements = res;
    });
  }

  loadDemande(){
    this.abonnementService.getAllAbonnementDemande().subscribe((res) => {
      this.abonnementDemande = res;
    });
  }





  //Modals
  ouvrirModal() {
    this.modalOuvert = true;
    this.mode = "add"
  }

  ouvrirModalEdit(a: any) {
    this.modalOuvert = true;
    this.abonnementForm = a;
    this.abonnementForm.prixActu = a.prix[a.prix.length-1].montant
    this.mode = "edit"
  }

  ouvrirModalListe() {
    this.modalOuvertListe = true;
    this.abonnementService.getAllAbonnementDemande().subscribe((res) => {
      this.abonnementDemande = res;
    });
  }

  fermerModal() {
    this.modalOuvert = false;
    this.modalOuvertListe = false;
    this.abonnementForm = {}
  }

  valide() {
    if(this.mode === "add"){
      this.abonnementForm.prix = [{"montant": this.abonnementForm.prixActu, "date": new Date()}]
      this.abonnementService.createAbonnement(this.abonnementForm).subscribe({
        next: (res) => {
          console.log('Abonnement Ajout', res);
          this.fermerModal();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Erreur createAbonnement', err);
        }
      });
      console.log(this.mode, this.abonnementForm)
    }else{
      this.abonnementForm.prix.push({
        montant: this.abonnementForm.prixActu,
        date: new Date()
      });
      this.abonnementService.updateAbonnement(this.abonnementForm).subscribe({
        next: (res) => {
          console.log('Abonnement update', res);
          this.fermerModal();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Erreur updateAbonnement', err);
        }
      });
      console.log(this.mode, this.abonnementForm)
    } 
  }

  validerDemande(a: any ){
      const demande = a;
      demande.statut = "VALIDE"
      this.abonnementService.getBoutiqueById(a.boutique.id).subscribe((res) => {
        const boutique = res;
        const abonnementFin: any = a.abonnement;
        abonnementFin.id = a.abonnement._id;
        abonnementFin.montant = a.abonnement.prix[a.abonnement.prix.length-1].montant;
        abonnementFin.date = new Date();
        boutique.abonnement.push(a.abonnement)
        console.log(boutique)
        this.abonnementService.updateAbonnementDemande(demande).subscribe((res) => {
          this.loadDemande
        });
        this.abonnementService.updateBoutique(boutique).subscribe({
          next: (res) => {
            console.log('Boutique update', res);
            this.loadDemande
          },
          error: (err) => {
            console.error('Erreur updateBoutique', err);
          }
        });
        
        
      });
      console.log(demande)
  }

  refuserDemande(a: any ){
      const demande = a;
      demande.statut = "REFUSE"
      this.abonnementService.updateAbonnementDemande(a).subscribe((res) => {
        this.loadDemande
      });
  }









  submit() {
    if (this.editId !== null) {
      this.abonnementService.update(this.editId, {
        label: this.label,
        montant: this.montant,
        description: this.description,
        prioriter: this.prioriter,
        date: this.date,
      });
    } else {
      this.abonnementService.add({
        label: this.label,
        montant: this.montant,
        description: this.description,
        prioriter: this.prioriter,
        date: this.date,
      });
    }
    this.resetForm();
    this.load();
  }

  edit(a: any) {
    this.editId = a.id;
    this.label = a.label;
    this.montant = a.prix[a.prix.length-1].montant;
    this.description = a.description;
    this.prioriter = a.priorite;
    this.duree = a.duree;
  }

  delete(id: number) {
    this.abonnementService.delete(id);
    this.load();
  }

  resetForm() {
    this.editId = null;
    this.label = '';
    this.montant = 0;
    this.description = '';
    this.prioriter = 1;
    this.date = new Date().toISOString().split('T')[0];
  }
}
