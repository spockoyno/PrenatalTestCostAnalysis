import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputCostsPregnancyComponent } from './output-costs-pregnancy.component';

describe('OutputCostsPregnancyComponent', () => {
  let component: OutputCostsPregnancyComponent;
  let fixture: ComponentFixture<OutputCostsPregnancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutputCostsPregnancyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutputCostsPregnancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
