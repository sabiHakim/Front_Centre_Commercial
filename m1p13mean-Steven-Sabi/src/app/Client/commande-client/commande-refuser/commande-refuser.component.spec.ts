import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeRefuserComponent } from './commande-refuser.component';

describe('CommandeRefuserComponent', () => {
  let component: CommandeRefuserComponent;
  let fixture: ComponentFixture<CommandeRefuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeRefuserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandeRefuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
