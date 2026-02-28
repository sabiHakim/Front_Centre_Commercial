import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalService } from './local.service';
import { Edit2, PlusCircle, Trash2, LucideAngularModule, List, XCircleIcon,CheckCircleIcon  } from 'lucide-angular';
@Component({
  selector: 'app-Local',
  standalone: true,
  imports: [FormsModule, CommonModule, LucideAngularModule],
  templateUrl: './Local.component.html',
  styleUrl: './Local.component.css',
})
export class LocalComponent implements OnInit {
  Edit2 = Edit2;
  EditIcon = Edit2;
  Trash2 = Trash2;
  PlusCircleIcon = PlusCircle;
  XCircleIcon = XCircleIcon;
  ListIcon = List
  CheckCircleIcon = CheckCircleIcon


  Locals:any[] = [];
  LocalsEtat:any[] = [];
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
  LocalForm: any = {};
  LocalDemande: any[] = [];

  constructor(private LocalService: LocalService) {}
  ngOnInit() {
    this.load();
  }

  load() {
    this.LocalService.getAllLocal().subscribe((res) => {
      this.Locals = res;
      console.log(res)
    });
    this.LocalService.getAllLocalEtat().subscribe((res) => {
      this.LocalsEtat = res;
    });
  }

  loadDemande(){
    this.LocalService.getAllLocalDemande().subscribe((res) => {
      this.LocalDemande = res;
    });
  }





  //Modals
  ouvrirModal() {
    this.modalOuvert = true;
    this.LocalForm.etat_libelle = 'LIBRE';
    this.mode = "add";
  }

  ouvrirModalEdit(a: any) {
    this.modalOuvert = true;
    this.LocalForm = a;
    this.LocalForm.etat_libelle = this.LocalForm.etat.libelle;
    this.LocalForm.montant = this.LocalForm.loyer[this.LocalForm.loyer.length-1].montant;
    this.mode = "edit"
  }

  ouvrirModalListe() {
    this.modalOuvertListe = true;
    this.LocalService.getAllLocalDemande().subscribe((res) => {
      this.LocalDemande = res;
      console.log(this.LocalDemande)
    });
    
  }

  fermerModal() {
    this.modalOuvert = false;
    this.modalOuvertListe = false;
    this.LocalForm = {}
  }

  valide() {
    if(this.mode === "add"){
      const etatLoc = this.LocalsEtat.filter(l => l.libelle === this.LocalForm.etat_libelle);
      const loyerLoc = {montant: this.LocalForm.montant, date: new Date()}
      this.LocalForm.etat =  {}
      this.LocalForm.etat.id = etatLoc[0]._id;
      this.LocalForm.etat.libelle = etatLoc[0].libelle;
      this.LocalForm.loyer = [loyerLoc];
      console.log(this.mode, this.LocalForm)
      
      this.LocalService.createLocal(this.LocalForm).subscribe({
        next: (res) => {
          console.log('Local Ajout', res);
          this.fermerModal();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Erreur createLocal', err);
        }
      });
      
    }else{
      const etatLoc = this.LocalsEtat.filter(l => l.libelle === this.LocalForm.etat_libelle);
      const loyerLoc = {montant: this.LocalForm.montant, date: new Date()}
      this.LocalForm.etat.id = etatLoc[0]._id;
      this.LocalForm.etat.libelle = etatLoc[0].libelle;
      this.LocalForm.loyer.push(loyerLoc);
      console.log(this.mode, this.LocalForm)

      this.LocalService.updateLocal(this.LocalForm).subscribe({
        next: (res) => {
          console.log('Local update', res);
          this.fermerModal();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Erreur updateLocal', err);
        }
      });
      
    } 
  }

  validerDemande(a: any ){
      const demande = a;
      let boutique: any = [];
      let newLocal: any = {};
      let oldLocal:any = {};
      this.LocalService.getBoutiqueById(a.boutique.id).subscribe((res) => {
        // New Local
        const etatLocOccupe = this.LocalsEtat.find(l => l.libelle === "OCCUPE");
        newLocal.etat = {
          _id: etatLocOccupe._id,
          libelle: etatLocOccupe.libelle,
          date_creation: etatLocOccupe.date_creation,
          date_update: etatLocOccupe.date_update
        };
        newLocal.loyer = a.local.loyer;
        newLocal._id = a.local.id;
        newLocal.taille = a.local.taille;
        newLocal.position = a.local.position;

        this.LocalService.updateLocal(newLocal).subscribe({
          next: (res) => {
            console.log('Local update', res);
            this.load();
          },
          error: (err) => {
            console.error('Erreur updateLocal', err);
          }
        });

        // Old Local
        const etatLocLibre = this.LocalsEtat.filter(l => l.libelle === "LIBRE")[0];
        oldLocal = this.Locals.filter(l => l._id === res.local[res.local.length-1].id)[0];
        oldLocal.etat = etatLocLibre
        this.LocalService.updateLocal(oldLocal).subscribe({
          next: (res) => {
            console.log('oldLocal update', res);
            this.load();
          },
          error: (err) => {
            console.error('Erreur updateLocal old', err);
          }
        });

        // Boutique
        boutique = res;
        const localBoutique:any = {};
        localBoutique.id = newLocal._id;
        localBoutique.position = newLocal.position;
        localBoutique.loyer = newLocal.loyer[newLocal.loyer.length-1].montant;
        localBoutique.date = new Date();

        boutique.local.push(localBoutique);
        console.log(boutique)
        this.LocalService.updateBoutique(boutique).subscribe({
          next: (res) => {
            console.log('Boutique update', res);
            this.loadDemande
          },
          error: (err) => {
            console.error('Erreur updateBoutique', err);
          }
        });

        // Demande
        demande.statut = "VALIDE";
        demande.local.etat = {};
        this.LocalService.updateLocalDemande(demande).subscribe((res) => {
          this.loadDemande
        });

        
      });
  }

  refuserDemande(a: any ){
      const demande = a;
      demande.statut = "REFUSE"
      this.LocalService.updateLocalDemande(a).subscribe((res) => {
        this.loadDemande
      });
  }









  submit() {
    if (this.editId !== null) {
      
    } else {
      
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
    this.LocalService.delete(id);
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
