import { Component, inject } from '@angular/core';
import { Store } from 'lucide-angular';
import { LucideAngularModule, LogOut, LayoutDashboard } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  protected readonly StoreIcon = Store;
  protected readonly LogOutIcon = LogOut;
  protected readonly LayoutDashboardIcon = LayoutDashboard;
  auth = inject(AuthService);
}
