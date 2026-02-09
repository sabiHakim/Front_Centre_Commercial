import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueAdminComponent } from './boutique-admin.component';

describe('BoutiqueAdminComponent', () => {
  let component: BoutiqueAdminComponent;
  let fixture: ComponentFixture<BoutiqueAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiqueAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoutiqueAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
