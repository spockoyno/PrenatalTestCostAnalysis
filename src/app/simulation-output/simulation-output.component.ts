import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy, NgZone
} from '@angular/core';
import * as PlotlyJS from 'plotly.js-dist-min';
import {Annotations, Data, Layout, Shape} from 'plotly.js-dist-min';
import {InteractorService} from "../CORE/interactor.service";
import {SimulatedOutputs} from "../CORE/model.view";
import {PlotlySharedModule} from "angular-plotly.js";
import {MatCardModule} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {AsyncPipe, CurrencyPipe, DecimalPipe, formatCurrency, NgIf} from "@angular/common";
import {round2} from "../DOMAIN/logic";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSlider, MatSliderRangeThumb} from "@angular/material/slider";
import {findMinAndMax} from "../DOMAIN/initiate";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-simulation-output',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatLabel,
    PlotlySharedModule, MatDivider, FormsModule, MatSlider, MatSliderRangeThumb, ReactiveFormsModule, NgIf, AsyncPipe, DecimalPipe, MatFormField, MatSelect, MatOption, MatTooltip
  ],
  templateUrl: './simulation-output.component.html',
  styleUrl: './simulation-output.component.scss'
})
export class SimulationOutputComponent implements AfterViewInit {
  @ViewChild('plotContainer') plotContainer!: ElementRef;


   summaries = new FormControl(['Low','High']);
  toppingList: string[] = ['Low', 'Mean', 'Median', 'High'];


  config = {
    responsive: true
  };


  data: Partial<Data>[] = [
    {x: [0], type: 'histogram', marker: {color: '#2B9CB3'}, histnorm: 'probability'},
  ];


  layout: Partial<Layout> = {
    // title: 'Simulated Cost Savings',
    xaxis: {
      range: [0, 1], titlefont: { // Optionally, override font settings for specific elements
        family: 'Roboto, sans-serif',
        size: 18,


      },   title: {text: 'Cost delta $M'},

    },
    yaxis: {
      title: 'Prob', titlefont: { // Optionally, override font settings for specific elements
        family: 'Roboto, sans-serif',
        size: 18,
      }
    },
    shapes: [] as Partial<Shape>[], // Using TypeScript type assertion here
    annotations: [] as Partial<Annotations>[], // Usi
    width: 1050, // adjust as necessary
    height: 450, // adjust as necessary
    margin: {t: 40}, // Adjust margins
    // margin: { t: 5, r: 40, b: 5, l: 55 }

  };

  plotRangeInput = this.fb.nonNullable.group({
    lower: 0,
    upper: 1,
    min: 0,
    max: 1
  })

  sliderVisible: boolean = false;

  labelHeight: number = 1

  constructor(public inter: InteractorService, public fb: FormBuilder, public cdr: ChangeDetectorRef, public ngZone: NgZone) {

  }

  ngAfterViewInit() {

    PlotlyJS.newPlot(this.plotContainer.nativeElement, this.data, this.layout, this.config)


    this.inter.newSimulatedValues$().subscribe(d => {
      this.updateSimulations(d);

      if (d.length > 0) {
        this.addStatsSummaries(this.inter.simulated$.value, this.summaries.getRawValue())

        if (!this.sliderVisible) {
          this.sliderVisible = true;
          this.cdr.detectChanges();
        }
        this.updateSliderRange();
      }
    });

    this.inter.simulatedSummaries$().subscribe(d => {
      this.addStatsSummaries(d, this.summaries.getRawValue())
    })
    this.plotRangeInput.valueChanges.subscribe(val => {

      const data = this.plotRangeInput.getRawValue()

      this.updatePlotRangeX(data.min, data.max)

    });

    this.summaries.valueChanges.subscribe(val => {

      this.addStatsSummaries(this.inter.simulated$.value, val)
    })
  }


  updateSimulations(sims: number[]) {


    // @ts-ignore
    this.data = [{...this.data[0], x: sims}]


    this.layout = {...this.layout, shapes: [], annotations: [], xaxis: {...this.layout.xaxis, autorange: true},
      yaxis: {...this.layout.yaxis, autorange: true}}

    PlotlyJS.react(this.plotContainer.nativeElement, this.data, this.layout, this.config)



    this.labelHeight =  this.plotContainer.nativeElement.layout.yaxis.range[1];

    this.layout = {...this.layout}; // Clone the layout object
    this.layout.yaxis = {...this.layout.yaxis, range: [0, this.labelHeight * 1.1], autorange: false};


    PlotlyJS.relayout(this.plotContainer.nativeElement, this.layout)

  }


  createAnnotation(x: number): Partial<Plotly.Annotations> {


    const moneyText = `${round2(x)}`
    return {
      x: x,
      y: -0.12,
      xref: 'x',
      yref: 'paper',
      text: moneyText,
      showarrow: false,

      bgcolor: 'white',
      arrowcolor: '#36454F',
      font: {
        family: 'Roboto, sans-serif',
        size: 17,
        color: '#36454F'
      }
    };
  }

  createLineShape(x: number): Partial<Plotly.Shape> {
    return {
      type: 'line',
      x0: x,
      x1: x,
      y0: 0,
      y1: this.labelHeight, // Extend the line to 110% of the max Y value
      xref: 'x',
      yref: 'y',
      opacity: 0.25,
      line: {
        color: 'black',
        width: 3,

      }
    };
  }

  createLabel(x: number, text: string): Partial<Plotly.Annotations> {
    return {
      x: x,
      y: 1.1, // Positioning label above the line
      xref: 'x',
      yref: 'paper', // Using 'paper' reference to place it at the top
      text: text,
      showarrow: false, // No arrow needed for labels
      font: {
        family: 'Roboto, sans-serif',
        size: 18,
        color: '#36454F'
      }
    };
  }


  addStatsSummaries(d: SimulatedOutputs, summaries: string[]|null) {
    if (d.costDiffs.length === 0) {
      return;
    }

    if (summaries === null){
      return;
    }




    // Inner function to add summary details

    this.layout.shapes = []
    this.layout.annotations = []
    const addSummary = (val: number, name: string) => {
      this.layout.shapes!.push(this.createLineShape(val));
      this.layout.annotations!.push(this.createLabel(val, name), this.createAnnotation(val));
    };

    // Use the inner function to update shapes and annotations
    if (summaries.includes("Low")) {
      addSummary(d.lowQuant, 'Low');
    }

    if (summaries.includes("Median")) {
      addSummary(d.median, 'Med');
    }

    if (summaries.includes("Mean")) {
      addSummary(d.mean, 'Mean');
    }


    if (summaries.includes("High")) {
      addSummary(d.upperQuant, 'High');
    }


    // Re-render the plot with updated layout
    PlotlyJS.react(this.plotContainer.nativeElement, this.data, this.layout, this.config);
  }


  updateSliderRange() {


    const range = this.plotContainer.nativeElement.layout.xaxis.range;
    this.plotRangeInput.setValue({lower: range[0], upper: range[1], min: range[0], max: range[1],});


  }


  private updatePlotRangeX(min: number, max: number) {
    // Clone the layout object to ensure change detection picks up the change
    this.layout = {...this.layout}; // Clone the layout object
    this.layout.xaxis = {...this.layout.xaxis, range: [min, max], autorange: false};


    PlotlyJS.relayout(this.plotContainer.nativeElement, this.layout)

  }

}

