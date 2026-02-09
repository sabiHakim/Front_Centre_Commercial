import { Component } from '@angular/core';
import { Store, ShoppingBag, Users, BarChart,UserCog,Zap } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
@Component({
  selector: 'app-acceuil',
  standalone: true,
  imports: [LucideAngularModule,RouterLink,NavbarComponent,FooterComponent],
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.css',
})
export class AcceuilComponent {
  protected readonly StoreIcon = Store;
  protected readonly ShoppingBagIcon = ShoppingBag;
  protected readonly UsersIcon = Users;
  protected readonly BarChartIcon = BarChart;
  protected readonly UserCogIcon = UserCog;
  protected readonly ZapIcon = Zap;
}
