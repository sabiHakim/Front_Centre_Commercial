import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProduitComponent } from './card-produit.component';

describe('CardProduitComponent', () => {
  let component: CardProduitComponent;
  let fixture: ComponentFixture<CardProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProduitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
