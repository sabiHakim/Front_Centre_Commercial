import { Component } from '@angular/core';
import { Store } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  protected readonly StoreIcon = Store;
}
