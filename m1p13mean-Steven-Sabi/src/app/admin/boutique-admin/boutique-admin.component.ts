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
  DollarSign,
  List
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
  ListIcon = List
  
  constructor(private service: ServiceAdminService) {}



  ngOnInit() {
    this.service.getAllBoutiques().subscribe((res) => {
      this.boutiques = res;
    });
  }
  // From base
  
  boutiques: any[] = [];
  users: any[] = [];
  locals: any[] = [];

  // ======= Modal unique =======
  modalOuvert: boolean = false;
  modalAjoutOuvert: boolean = false;
  mode: 'ajout' | 'loyer' | 'edition' = 'ajout';

  // Data Save
  loyerRestant : number = 0;
  payer : number = 0;
  montant : number = 0;
  modaleCategorie = false
  
  // Form
  boutique : any = this.getBoutiqueFormVide();
  boutiqueForm: any = this.getBoutiqueVide();
  localForm: any = this.getLocalVide();

  // Champs recherche
  searchUser: string = '';
  filteredUsers: any[] = [];
  searchLocal: string = '';
  filteredLocals: any[] = [];
  categorie:any = {};


  //Function
  updateLoyerRestant() {
    if (!this.boutiqueForm.mois || !this.boutiqueForm.annee) {
      this.loyerRestant =  0;
      this.payer = 0;
      this.montant = this.boutiqueForm.local[this.boutiqueForm.local.length-1].loyer;
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
        this.montant = total;
        const payer = filtre.reduce((sum, p) => sum + (p.montant_payer || 0), 0);
        this.payer = payer;
        this.loyerRestant = total - payer;
      } else {
        // Si aucun paiement trouvé, afficher le loyer du dernier local
        this.montant = this.boutiqueForm.local[this.boutiqueForm.local.length-1].loyer;
        this.loyerRestant = 0;
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

  filterUsers() {
    const value = this.searchUser.toLowerCase();
  
    if (!value) {
      this.filteredUsers = [];
      return;
    }
  
    this.filteredUsers = this.users.filter(u =>
      u.nom.toLowerCase().includes(value) ||
      u.prenom.toLowerCase().includes(value) ||
      u.email.toLowerCase().includes(value)
    );
  }

  selectUser(user: any) {
    this.boutique.user = user;
    this.searchUser = `${user.nom} ${user.prenom} - ${user.email}`;
    this.filteredUsers = [];
  }

  filterLocals(){
    const value = this.searchLocal.toLowerCase();
  
    if (!value) {
      this.filteredLocals = [];
      return;
    }
  
    this.filteredLocals = this.locals.filter(u =>
      u.etat.libelle === "LIBRE" &&
      u.position.toLowerCase().includes(value) ||
      u.taille.toString().includes(value)
    );
  }

  selectLocal(local: any) {
    this.localForm = local;
    this.searchLocal = `${local.position} -- ${local.taille}m3 -- ${local.loyer[local.loyer.length-1].montant}Ar`;
    this.filteredLocals = [];
  }

  ajoutBoutiqueAdmin(){
    console.log(this.boutique)
    console.log(this.localForm)
    const theBoutique:any = {};
    theBoutique.nom = this.boutique.nom;
    theBoutique.users = [];
    theBoutique.users.push({
      id_user: this.boutique.user._id,
      nom: this.boutique.user.nom,
      prenom: this.boutique.user.prenom,
      email: this.boutique.user.email,
      contact: this.boutique.user.contact
    });
    theBoutique.local = 
            [{"id":this.localForm._id, 
              "position":this.localForm.position, 
              "loyer":this.localForm.loyer[this.localForm.loyer.length-1].montant,
              "date":new Date()
            }];
    theBoutique.abonnement = [];
    theBoutique.logo = "";
    theBoutique.fond = "";
    theBoutique.description = "";
    theBoutique.etat = 
    {
      id : 1,
      libelle: "Actif"
    }

    const theLocal:any =  this.localForm;
    theLocal.etat = {
                      "id": "699ecb4ba0a24330031b203e",
                      "libelle": "OCCUPE"
                    }
    const theUser:any = this.boutique.user;
    theUser.role = 
                  {
                    "id": "2",
                    "label": "BOUTIQUE"
                  }

    console.log(theBoutique);
    console.log(theLocal);
    console.log(theUser);
    if (confirm('Ajouter cette boutique !')) {
      this.service.createBoutique(theBoutique).subscribe({
        next: (res) => {
          console.log('Boutique créé', res);
          this.ngOnInit();
          this.fermerModal();
        },
        error: (err) => {
          console.error('Erreur création boutique', err);
        }
      });

      this.service.updateLocal(theLocal).subscribe({
        next: (res) => {
          console.log('Local Update', res);
        },
        error: (err) => {
          console.error('Erreur updateLocal', err);
        }
      });

      this.service.updateUser(theUser).subscribe({
        next: (res) => {
          console.log('User update', res);
        },
        error: (err) => {
          console.error('Erreur updateUser', err);
        }
      });


    }
    
  }







  //Modale
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

  ouvrirModalAjout() {
    this.mode = 'ajout';
    this.localForm = this.getLocalVide();
    this.modalAjoutOuvert = true;
    this.service.getAllUsers().subscribe((res) => {
      this.users = res;
    });
    this.service.getAllLocals().subscribe((res) => {
      this.locals = res;
    });
  }

  handleAction(b : any) {
    if (confirm('Rendre inactif cette boutique')) {
      console.log(b)
      if(b.etat.id === "1"){
        b.etat = {id:"2", libelle:"Inactif"}
      }else{
        b.etat = {id:"1", libelle:"Actif"}
      }
      
      this.service.updateBoutique(b).subscribe({
        next: (res) => {
          console.log('Boutique update', res);
          this.fermerModal();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Erreur updateBoutique', err);
        }
      });
      
    }
  }

  ouvrirModalAjoutCat() {
    this.modaleCategorie = true; 
  }

  ajoutCategorie(){
    console.log(this.categorie)
    this.categorie.base = null
    console.log(this.categorie)
    this.service.createCategorie(this.categorie).subscribe({
      next: (res) => {
        console.log('Categorie creat', res);
        this.fermerModal();
      },
      error: (err) => {
        console.error('Erreur creatCategorie', err);
      }
    });
  }














  ouvrirModalEdition(b: any) {
    this.mode = 'edition';
    this.boutiqueForm = { ...b };
    // this.modalOuvert = true;
  }

  fermerModal() {
    this.modalOuvert = false;
    this.modalAjoutOuvert = false;
    this.boutiqueForm = this.getBoutiqueVide();
    this.boutique = this.getBoutiqueFormVide();
    this.localForm = this.getLocalVide();
    this.searchUser = "";
    this.modaleCategorie = false; 
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

  getLocalVide() {
    return {
      position: '',
      loyer:{},
      etat:{},
      createdAt: new Date().toISOString().split('T')[0],
    };
  }

  getBoutiqueFormVide() {
    return {
      nom: '',
      user: {},
      createdAt: new Date().toISOString().split('T')[0],
    };
  }

  // ======= Actions =======
  toggle(id: number) {
    this.service.toggleStatus(id);
  }

  
}
