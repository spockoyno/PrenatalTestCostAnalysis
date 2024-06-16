import {AfterViewInit, Component, ViewChild} from '@angular/core';
// import { ChartsModule } from 'ng2-charts';
import {Chart, ChartConfiguration, registerables} from 'chart.js';
import {BehaviorSubject} from "rxjs";
import {ScenarioOutputsView} from "../CORE/model.view";
import {InteractorService} from "../CORE/interactor.service";
import {AsyncPipe, CurrencyPipe, PercentPipe} from "@angular/common";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
Chart.register(...registerables);


@Component({
  selector: 'app-output-costs-pregnancy',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, PercentPipe, MatCard, MatCardHeader,  MatCardTitle, MatCardContent],
  templateUrl: './output-costs-pregnancy.component.html',
  styleUrl: './output-costs-pregnancy.component.scss'
})
export class OutputCostsPregnancyComponent implements AfterViewInit {
  @ViewChild('barChart') barChart: any; // Adjust type as needed
  public chart: Chart | undefined;
  public showTop: BehaviorSubject<ScenarioOutputsView>;

  constructor(public interactor: InteractorService) {
    this.showTop = new BehaviorSubject<ScenarioOutputsView>(interactor.currentScenarioOutputView())
    this.interactor.computedObservable().subscribe(d => {
      this.showTop.next(d)
    })
  }

  ngAfterViewInit() {
    this.createChart();
    this.interactor.computedObservable().subscribe(d => {
      this.updateChart(d);
    });
  }

  createChart() {
    const data = {
      labels: ['Base', 'Reflex'],
      datasets: [{
        label: 'Cost Comparison',
        data: [1, 1],
        backgroundColor: ['#D2ECF3', '#2B9CB3']
      }]
    };

    const config: ChartConfiguration<'bar', number[], string> = {

      type: 'bar',
      data: data,
      options: {
        responsive: true,
        aspectRatio:2.5,
        scales: {
          x: {},
          y: {
            beginAtZero: true
          }
        },

        plugins: {
          legend: {
            display: false
          }
        }
      }
    };

    this.chart = new Chart(this.barChart.nativeElement, config);
  }

  updateChart(d: ScenarioOutputsView) {
    if (this.chart) {
      this.chart.data.datasets.forEach(dataset => {
        dataset.data = [d.costBase, d.costReflex];
      });
      this.chart.update();
    }
  }

  private formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`; // Simple currency formatting
  }

}
