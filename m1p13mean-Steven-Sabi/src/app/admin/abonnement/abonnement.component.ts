import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbonnementService, Abonnement } from './abonnement.service';
import { Edit2, PlusCircle, Trash2, LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'app-abonnement',
  standalone: true,
  imports: [FormsModule, CommonModule, LucideAngularModule],
  templateUrl: './abonnement.component.html',
  styleUrl: './abonnement.component.css',
})
export class AbonnementComponent implements OnInit {
  Edit2 = Edit2;
  Trash2 = Trash2;
  PlusCircle = PlusCircle;
  abonnements: Abonnement[] = [];
  label = '';
  montant = 0;
  description = '';
  prioriter = 1;
  date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  editId: number | null = null;

  constructor(private abonnementService: AbonnementService) {}
  ngOnInit() {
    this.load();
  }

  load() {
    this.abonnements = this.abonnementService.getAll();
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

  edit(a: Abonnement) {
    this.editId = a.id;
    this.label = a.label;
    this.montant = a.montant;
    this.description = a.description;
    this.prioriter = a.prioriter;
    this.date = a.date;
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
