import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyerBoutiqueComponent } from './loyer-boutique.component';

describe('LoyerBoutiqueComponent', () => {
  let component: LoyerBoutiqueComponent;
  let fixture: ComponentFixture<LoyerBoutiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyerBoutiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoyerBoutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
