import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitBoutiqueComponent } from './produit-boutique.component';

describe('ProduitBoutiqueComponent', () => {
  let component: ProduitBoutiqueComponent;
  let fixture: ComponentFixture<ProduitBoutiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitBoutiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProduitBoutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
