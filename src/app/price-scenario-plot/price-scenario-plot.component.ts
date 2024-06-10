import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import * as PlotlyJS from 'plotly.js-dist-min';
import {PlotlyModule} from 'angular-plotly.js';
import {InteractorService} from "../CORE/interactor.service";
import {ScenarioOutputsView} from "../CORE/model.view";

PlotlyModule.plotlyjs = PlotlyJS;
import {Data, Layout} from 'plotly.js-dist-min';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {BehaviorSubject} from "rxjs";
import {AsyncPipe, CurrencyPipe, PercentPipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {PriceScenariosHelpComponent} from "../ELEMS/price-scenarios-help/price-scenarios-help.component";
import {MatIcon} from "@angular/material/icon";



@Component({
  selector: 'app-price-scenario-plot',
  standalone: true,
  imports: [PlotlyModule, MatCard, MatCardContent, MatCardHeader, MatCardTitle, AsyncPipe, CurrencyPipe, PercentPipe, MatIcon],
  templateUrl: './price-scenario-plot.component.html',
  styleUrl: './price-scenario-plot.component.scss'
})
export class PriceScenarioPlotComponent implements AfterViewInit {
  @ViewChild('plotContainer') plotContainer!: ElementRef;

  public showTop: BehaviorSubject<ScenarioOutputsView>;

  config = {
    responsive: true
  };


  // Define 'data' and 'layout' as separate variables
 data: Partial<Data>[] = [
    {
      x: [0],
      y: [1],
      text: [""],
      textposition: 'bottom right',
      line: {color: 'lightgrey', width: 3},
      type: 'scatter',
      mode: 'lines',
    },
     {
      x: [0],
      y: [1],
       text: [""],
      textfont: {
        family: 'Roboto, sans-serif',
        size: 16,
      },
      textposition: 'top right',
  marker: {color: '#36454F', size: 12},
      type: 'scatter',
      mode: 'text+markers',
    },
    {
      x: [0, 5],
      y: [0, 15],
      text: [""],
      textfont: {
        family: 'Roboto, sans-serif',
        size: 16,
      },
      textposition: 'bottom right',
      type: 'scatter',
      mode: 'text+lines+markers',
      marker: {color: '#2B9CB3', size: 14},
      line: {color: '#D2ECF3', width: 6},
    }
  ];

   layout: Partial<Layout> = {
    // title: { text: 'Price Scenarios' },
    showlegend: false,
    xaxis: {
      title: {text: 'Screen Price $'},
      range: [0, 5],
      zeroline: false,
      autorange: false,
      titlefont: { // Optionally, override font settings for specific elements
        family: 'Roboto, sans-serif',
        size: 18,
      },
       showgrid: false,

    },
    yaxis: {
      title: {text: 'Cost $M'},
      showline: false,

      range: [0, 5],
      autorange: false,
      titlefont: { // Optionally, override font settings for specific elements
        family: 'Roboto, sans-serif',
        size: 18,
      },

    },
     margin: { t: 20, r: 40, b: 45, l: 55 },

     width: 700, // adjust as necessary
     height: 400, // adjust as necessary
     // margin: {t: 40}, // Adjust margins
  };


  constructor(public interactor: InteractorService, public dialog: MatDialog) {

      this.showTop = new BehaviorSubject<ScenarioOutputsView>(interactor.currentScenarioOutputView())

      this.interactor.computedObservable().subscribe(d => {
      this.showTop.next(d)
    })

  }

  openDialog() {
    this.dialog.open(PriceScenariosHelpComponent);
  }


  private formatCurrency(value: number): string {
  // Check if the value is 10000 or more
  if (value >= 10000) {
    return `$${(value / 1000).toFixed(0)}K`; // Rounds to nearest thousand, appends 'K'
  } else {
    return `$${Math.round(value)}`; // Rounds to nearest dollar for values under $10,000
  }
}


  ngAfterViewInit() {
    PlotlyJS.newPlot(this.plotContainer.nativeElement, this.data, this.layout, this.config);
    this.interactor.computedObservable().subscribe(d => {
      this.updatePlot(d)
    })

    this.updatePlot(this.interactor.currentScenarioOutputView())


  }

  private updatePlot(d: ScenarioOutputsView) {

    const prices: number[] = d.reflexPricingScenarios.map(s => s.price);
    const costs: number[] = d.reflexPricingScenarios.map(s => s.costFetus);
    const percents = d.reflexPricingScenarios.map(s => `${s.passedPercent * 100}%`);


    const maxX: number = 1.1 * Math.max(...prices, 0);
    const maxY: number = Math.max(...costs, 0);

    const priceDots = [prices[0], prices[prices.length - 1]]
    const dotText = [this.formatCurrency(priceDots[0]), this.formatCurrency(priceDots[1])];


    // @ts-ignore
    this.data = [// @ts-ignore
      {...this.data[0], x: [0, maxX], y: [maxY, maxY]},
      // @ts-ignore
      {...this.data[1], x: priceDots, y: [maxY, maxY], text: dotText},
      // @ts-ignore
      {...this.data[2], x: prices, y: costs, text: percents}
    ];

    this.layout = {
      ...this.layout,
      xaxis: {...this.layout.xaxis, range: [0, maxX]},
      yaxis: {...this.layout.yaxis, range: [0, 1.1 * maxY]}
    };

    PlotlyJS.react(this.plotContainer.nativeElement, this.data, this.layout, this.config)

  }
}
