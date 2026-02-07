import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilComponentAdmin } from './acceuil.component';

describe('AcceuilComponent', () => {
  let component: AcceuilComponentAdmin;
  let fixture: ComponentFixture<AcceuilComponentAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuilComponentAdmin]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceuilComponentAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
