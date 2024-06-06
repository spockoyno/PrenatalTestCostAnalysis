import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceScenarioPlotComponent } from './price-scenario-plot.component';

describe('PriceScenarioPlotComponent', () => {
  let component: PriceScenarioPlotComponent;
  let fixture: ComponentFixture<PriceScenarioPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceScenarioPlotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PriceScenarioPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
