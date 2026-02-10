import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeBoutiqueComponent } from './commande-boutique.component';

describe('CommandeBoutiqueComponent', () => {
  let component: CommandeBoutiqueComponent;
  let fixture: ComponentFixture<CommandeBoutiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeBoutiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandeBoutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
