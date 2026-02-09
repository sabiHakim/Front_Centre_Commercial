import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Store,
  CheckCircle,
  XCircle,
  PlusCircle,
} from 'lucide-angular';
import { ServiceAdminService } from '../service-admin.service';
@Component({
  selector: 'app-acceuil',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.css',
})
export class AcceuilComponentAdmin implements OnInit {
  constructor(private adminService: ServiceAdminService) {}
  stats: any;
  StoreIcon = Store;
  CheckCircleIcon = CheckCircle;
  XCircleIcon = XCircle;
  PlusCircleIcon = PlusCircle;
  ngOnInit() {
    this.stats = this.adminService.getStats();
  }
}
