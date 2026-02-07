import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilBoutiqueComponent } from './acceuil-boutique.component';

describe('AcceuilBoutiqueComponent', () => {
  let component: AcceuilBoutiqueComponent;
  let fixture: ComponentFixture<AcceuilBoutiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuilBoutiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceuilBoutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
