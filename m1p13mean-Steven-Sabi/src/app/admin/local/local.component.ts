import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalService, Local } from './local.service';
import { LucideAngularModule, Edit2, Trash2, PlusCircle } from 'lucide-angular';
@Component({
  selector: 'app-local',
  standalone: true,
  imports: [CommonModule, FormsModule,LucideAngularModule],
  templateUrl: './local.component.html',
  styleUrl: './local.component.css',
})
export class LocalComponent {
  locaux: Local[] = [];

  // Formulaire
  taille = '';
  position = '';
  loyer = 0;
  etat = 'libre';
  editId: number | null = null;

  // Icônes
  PlusCircle = PlusCircle;
  Edit2 = Edit2;
  Trash2 = Trash2;

  constructor(private localService: LocalService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.locaux = this.localService.getAll();
  }

  submit() {
    // validation : tous les champs remplis
    if (!this.taille || !this.position || !this.loyer || !this.etat) return;

    if (this.editId !== null) {
      this.localService.update(this.editId, {
        taille: this.taille,
        position: this.position,
        loyer: this.loyer,
        etat: this.etat,
      });
    } else {
      this.localService.add({
        taille: this.taille,
        position: this.position,
        loyer: this.loyer,
        etat: this.etat,
      });
    }

    this.resetForm();
    this.load();
  }

  edit(local: Local) {
    this.editId = local.id;
    this.taille = local.taille;
    this.position = local.position;
    this.loyer = local.loyer;
    this.etat = local.etat;
  }

  delete(id: number) {
    this.localService.delete(id);
    this.load();
  }

  resetForm() {
    this.editId = null;
    this.taille = '';
    this.position = '';
    this.loyer = 0;
    this.etat = 'libre';
  }
}
