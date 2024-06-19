import {Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ScenarioOutputsView} from "../CORE/model.view";
import {InteractorService} from "../CORE/interactor.service";
import {AsyncPipe, CurrencyPipe, PercentPipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {Data, Layout} from 'plotly.js-dist-min';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {PlotlyModule, PlotlyService} from "angular-plotly.js";


@Component({
  selector: 'app-outputs',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    CurrencyPipe,
    PercentPipe,
    PlotlyModule
  ],
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements AfterViewInit {


  public showTop: BehaviorSubject<ScenarioOutputsView>;


  public layout: Partial<Layout> = {
    // width: 230,
    // height: 300,
      xaxis: {
    tickfont: {
      family: 'Roboto, sans-serif',
      size: 18,
    },
        showticklabels: true,
          showgrid: false,
  },
    yaxis: {showticklabels: false,   showgrid: false,},
    margin: { t: 25, r: 0, b: 30, l: 0 },
    autosize: true,
  };
  public data: Partial<Data>[] = [{
    x: ['Base', 'Reflex'],
    y: [1, 1],
    type: 'bar',
    marker: {
      color: ['#D2ECF3', '#2B9CB3']
    },
    textfont: {
      family: 'Roboto, sans-serif',
      size: 16,
    },
    text: ["", ""],
    textposition: 'auto',
    hoverinfo: 'none'
  }];


  config = {
    // responsive: true,
    displaylogo: false,
  };

  constructor(public interactor: InteractorService, public service: PlotlyService) {

    this.showTop = new BehaviorSubject<ScenarioOutputsView>(interactor.currentScenarioOutputView())
    this.interactor.computedObservable().subscribe(d => {
      this.updateGraph(d);
      this.showTop.next(d)
    })

  }

  ngAfterViewInit() {

    // this.interactor.computedObservable().subscribe(d => {
    //   this.updateGraph(d);
    // })

  }

  updateGraph(d: ScenarioOutputsView) {
    const updatedData = {
      ...this.data[0],
      y: [d.costBase, d.costReflex],
      text: [this.formatCurrency(d.costBase), this.formatCurrency(d.costReflex)]
    };

    this.data = [updatedData]
  }


  private formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`; // Simple currency formatting: $1,234.56
  }


}
