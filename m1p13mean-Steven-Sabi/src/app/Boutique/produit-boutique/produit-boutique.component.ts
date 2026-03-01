import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceBoutiqueService, Produit } from '../service-boutique.service';
import { LucideAngularModule, Edit, Trash, Package, AlertCircle, CheckCircle } from 'lucide-angular';
import { OnDestroy } from '@angular/core';
@Component({
  selector: 'app-produit-boutique',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './produit-boutique.component.html',
  styleUrl: './produit-boutique.component.css',
})
export class ProduitBoutiqueComponent implements OnInit, OnDestroy {
  //on destroys
  autoSlideIntervals: { [key: string]: any } = {};

  startAutoSlide(produit: any) {
    this.autoSlideIntervals[produit.currentImage] = setInterval(() => {
      this.nextImage(produit);
    }, 3000); // change toutes les 3 secondes
  }
  ngOnDestroy(): void {
    Object.values(this.autoSlideIntervals).forEach((interval) =>
      clearInterval(interval),
    );
  }
  EditIcon = Edit;
  TrashIcon = Trash;
  PackageIcon = Package;
  AlertCircleIcon = AlertCircle
  CheckCircleIcon = CheckCircle
  currentIndex = 0;

  produits: any[] = [];
  categories: any[] = [];
  mode = "add";

  constructor(private boutiqueService: ServiceBoutiqueService) {}

  modalOuvert = false;
  modalOuvertEdit = false;
  modalOuvertAddSolde = false;
  modalOuvertAddCatego = false;

  // Pour stocker les index des images par produit
  currentImageIndex: { [key: number]: number } = {};

  // Champ texte pour saisir plusieurs URLs
  imagesInput: string = '';
  nouveauProduit: any = { };
  currentUser: any;
  myBoutique: any = [];
  currentBoutique: any = {};
  editProduit: any = {};


  ngOnInit(): void {
    this.boutiqueService.getAllProduit().subscribe({
      next: (data: Produit[]) => {
        this.produits = data.map((p: any) => ({
          ...p,
          currentImage: 0
        }));
      }
    });

    this.boutiqueService.getAllProduitCatego().subscribe({
      next: (data: any[]) => {
        this.categories = data
      }
    });

    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    } else {
      this.currentUser = null;
    };


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
      console.log(this.myBoutique);
      this.currentBoutique = this.myBoutique[0]
    });
    

    this.produits.forEach((produit) => {
      if (this.hasMultipleImages(produit)) {
        this.startAutoSlide(produit);
      }
    });
    console.log(this.produits, this.currentUser, this.currentBoutique)
    
  }

  setCurrentBoutique(boutique: any){
    this.currentBoutique = boutique
  }

  changeEtat(produit :any){
    if(produit.etat.id === "1"){
      produit.etat.id = 0;
      produit.etat.libelle = "CACHER"
    }else{
      produit.etat.id = 1;
      produit.etat.libelle = "AFFICHER"
    }
    this.boutiqueService.updateProduit(produit).subscribe({
      next: (res) => {
        console.log('Local update', res);
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Erreur updateLocal', err);
      }
    });
    console.log(produit);
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log("Fichier sélectionné:", file);
    }
  }

  addProduit(){
    // console.log(this.currentBoutique)
    this.nouveauProduit.categorie = [];
    this.nouveauProduit.solde = [];
    this.nouveauProduit.images = [];
    this.nouveauProduit.id_boutique = this.currentBoutique._id;
    this.nouveauProduit.boutique = {}
    this.nouveauProduit.boutique.nom = this.currentBoutique.nom;
    this.nouveauProduit.boutique.description = this.currentBoutique.description;
    this.nouveauProduit.boutique.logo = this.currentBoutique.logo;
    this.nouveauProduit.boutique.id = this.currentBoutique._id;
    this.nouveauProduit.prix = {montant: this.nouveauProduit.montant, date: new Date};
    this.nouveauProduit.etat = {
        "id": "1",
        "libelle": "AFFICHER"
    }
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile); // TypeScript OK car non null
      
      this.boutiqueService.upload(formData).subscribe({
        next: (res) => {
          console.log('Upload', res);
          this.nouveauProduit.images.push(res);
          this.fermerModal()
          this.boutiqueService.createProduit(this.nouveauProduit).subscribe({
            next: (res) => {
              console.log('Add produit', res);
              let stock = {
                "id_produit": res._id,
                "type": {
                    "id": "699ecfeb4ee310f92e3aa5f9",
                    "label": "ENTREE"
                },
                "qte": this.nouveauProduit.qte
              }
              this.boutiqueService.createInStock(stock).subscribe({
                next: (res) => {
                  console.log('Stock ajouter', res);
                },
                error: (err) => {
                  console.error('Erreur ajout stock', err);
                }
              });
            },
            error: (err) => {
              console.error('Erreur add produit', err);
            }
          });
        },
        error: (err) => {
          console.error('Upload erreur', err);
        }
      });
    } else {
      console.log("Aucun fichier sélectionné !");
      this.boutiqueService.createProduit(this.nouveauProduit).subscribe({
        next: (res) => {
          console.log('Add produit', res);
          let stock = {
            "id_produit": res._id,
            "type": {
                "id": "699ecfeb4ee310f92e3aa5f9",
                "label": "ENTREE"
            },
            "qte": this.nouveauProduit.qte
          }
          this.boutiqueService.createInStock(stock).subscribe({
            next: (res) => {
              console.log('Stock ajouter', res);
            },
            error: (err) => {
              console.error('Erreur ajout stock', err);
            }
          });
        },
        error: (err) => {
          console.error('Erreur add produit', err);
        }
      });
    }
    this.fermerModal()
    console.log(this.nouveauProduit)
  }

  modifierProduit() {
    console.log(this.editProduit)
    this.editProduit.qte = Number(this.editProduit.qte)+Number(this.editProduit.stock);
    let stock = {
      "id_produit": this.editProduit._id,
      "type": {
          "id": "699ecfeb4ee310f92e3aa5f9",
          "label": "ENTREE"
      },
      "qte": this.editProduit.stock
    }
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile); // TypeScript OK car non null
      
      this.boutiqueService.upload(formData).subscribe({
        next: (res) => {
          console.log('Upload', res);
          this.editProduit.images.push(res);
          this.fermerModal()
          this.boutiqueService.updateProduit(this.editProduit).subscribe({
            next: (res) => {
              console.log('Update produit', res);
  
            },
            error: (err) => {
              console.error('Erreur update produit', err);
            }
          });
          this.boutiqueService.createInStock(stock).subscribe({
            next: (res) => {
              console.log('Stock ajouter', res);
  
            },
            error: (err) => {
              console.error('Erreur ajout stock', err);
            }
          });
        },
        error: (err) => {
          console.error('Upload erreur', err);
        }
      });
    } else {
      console.log("Aucun fichier sélectionné !");
      this.boutiqueService.updateProduit(this.editProduit).subscribe({
        next: (res) => {
          console.log('Update produit', res);
        },
        error: (err) => {
          console.error('Erreur update produit', err);
        }
      });
      this.boutiqueService.createInStock(stock).subscribe({
        next: (res) => {
          console.log('Stock ajouter', res);
        },
        error: (err) => {
          console.error('Erreur ajout stock', err);
        }
      });
    }
    this.fermerModal()
  }
  addSolde(){
    let solde:any = {};
    solde.debut = this.editProduit.debut;
    solde.fin = this.editProduit.fin;
    solde.pourcentage = this.editProduit.pourcentage;
    this.editProduit.solde.push(solde);
    this.boutiqueService.updateProduit(this.editProduit).subscribe({
      next: (res) => {
        console.log('Update produit', res);
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Erreur update produit', err);
      }
    });

    console.log(this.editProduit)
    this.fermerModal()
  }

  addCatego(){
    console.log(this.categories);
    const categoriesActives = this.categories
      .filter(cat => cat.active)        // garde seulement les actives
      .map(cat => ({ id: cat._id, label: cat.label })); 
    this.editProduit.categories = [];
    this.editProduit.categories.push(...categoriesActives);
    console.log(this.editProduit)
    this.boutiqueService.updateProduit(this.editProduit).subscribe({
      next: (res) => {
        console.log('Update produit', res);
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Erreur update produit', err);
      }
    });
    this.fermerModal();
  }





  ouvrirModalAddSolde(produit: Produit){
    this.editProduit = produit;
    this.modalOuvertAddSolde = true;
    console.log(produit)
  }

  ouvrirModalAddCatego(produit: any){
    this.editProduit = produit;

    // Crée un tableau de labels existants
    const labelsExistants = produit.categories.map((c: any) => c.label);

    // Initialise le champ `active` selon les catégories déjà présentes
    this.categories = this.categories.map(cat => ({
      ...cat,
      active: labelsExistants.includes(cat.label)
    }));

    this.modalOuvertAddCatego = true;
  }



  ouvrirModalModifierProduit(produit: Produit) {
    this.mode = "edit"
    this.editProduit = produit;
    this.editProduit.stock = 0;
    this.modalOuvertEdit = true;
  }


  ouvrirModal() {
    this.nouveauProduit = {
      id: 0,
      nom: '',
      description: '',
      prix: 0,
      stock: 0,
      images: [],
    };
    this.imagesInput = '';
    this.modalOuvert = true;
  }

  fermerModal() {
    this.ngOnInit()
    this.modalOuvert = false;
    this.modalOuvertEdit = false;
    this.modalOuvertAddSolde = false;
    this.modalOuvertAddCatego = false;
  }

  confirmerAjout() {
    // Convertir texte en tableau
    this.nouveauProduit.images = this.imagesInput
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url !== '');

    // this.boutiqueService.ajouterProduit(this.nouveauProduit);
    this.produits = this.boutiqueService.getProduits();

    this.modalOuvert = false;
    this.imagesInput = '';
  }



  supprimerProduit(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.boutiqueService.supprimerProduit(id);
      this.produits = this.boutiqueService.getProduits();
    }
  }
  hasImages(produit: Produit): boolean {
    return !!produit.images && produit.images.length > 0;
  }

  hasMultipleImages(produit: Produit): boolean {
    return !!produit.images && produit.images.length > 1;
  }

  // =========================
  // SLIDER LOGIQUE
  // =========================

  nextImage(produit: any) {
    if(produit.images.length-1>produit.currentImage){
      produit.currentImage = produit.currentImage + 1;
    }else{
      produit.currentImage = 0
    }
     
  }

  prevImage(produit: any) {
    if(produit.images.length-1<=produit.currentImage){
      produit.currentImage = produit.currentImage - 1;
    }else{
      produit.currentImage = produit.images.length - 1
    }
  }

  getCurrentImage(produit: Produit): string {
    if (!produit.images || produit.images.length === 0) {
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }
    // const index = this.currentImageIndex[produit._id] ?? 0;
    const index = this.currentImageIndex[0] ?? 0;
    return produit.images[index];
  }
}
