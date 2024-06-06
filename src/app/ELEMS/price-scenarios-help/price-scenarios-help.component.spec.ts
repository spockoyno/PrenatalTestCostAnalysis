import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceScenariosHelpComponent } from './price-scenarios-help.component';

describe('PriceScenariosHelpComponent', () => {
  let component: PriceScenariosHelpComponent;
  let fixture: ComponentFixture<PriceScenariosHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceScenariosHelpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PriceScenariosHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
