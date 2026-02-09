import { Component } from '@angular/core';
import { Store } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  protected readonly StoreIcon = Store;
}
