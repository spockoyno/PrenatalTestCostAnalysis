import {Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ScenarioOutputsView} from "../CORE/model.view";
import {InteractorService} from "../CORE/interactor.service";
import {AsyncPipe, CurrencyPipe, PercentPipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import * as PlotlyJS from 'plotly.js-dist-min';
import {Data, Layout} from 'plotly.js-dist-min';
import {FormControl} from "@angular/forms";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";




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
    PercentPipe
  ],
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements AfterViewInit {
  @ViewChild('plotContainer') plotContainer!: ElementRef;

public showTop: BehaviorSubject<ScenarioOutputsView>;


  public layout: Partial<Layout> = {
    width: 300,
    height: 300,
      xaxis: {
    tickfont: {
      family: 'Roboto, sans-serif',
      size: 18,
    },
        showticklabels: true,
          showgrid: false,
  },
    yaxis: {showticklabels: false,   showgrid: false,},
    margin: { t: 15, r: 40, b: 30, l: 30 }
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
    responsive: true,
  autosize: true,
  // height: "30%",
  // width:  "30%",
  };

  constructor(public interactor: InteractorService) {

  this.showTop = new BehaviorSubject<ScenarioOutputsView>(interactor.currentScenarioOutputView())

      this.interactor.computedObservable().subscribe(d => {
      this.showTop.next(d)
    })


  }

  ngAfterViewInit() {
    PlotlyJS.newPlot(this.plotContainer.nativeElement, this.data, this.layout, this.config);

     this.interactor.computedObservable().subscribe(d => {
      this.updatePlot(d)
    })

  }


  private formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`; // Simple currency formatting: $1,234.56
  }

  updatePlot(d: ScenarioOutputsView) {
    const updatedData = {
      ...this.data[0],
      y: [d.costBase, d.costReflex],
      text: [this.formatCurrency(d.costBase), this.formatCurrency(d.costReflex)]
    };

    this.data = [updatedData]
    // Using Plotly.react for efficient updating
    PlotlyJS.react(this.plotContainer.nativeElement, this.data, this.layout, this.config);
  }

}
