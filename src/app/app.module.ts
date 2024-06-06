import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule} from 'angular-plotly.js';
import { MatSliderModule } from '@angular/material/slider';
import {BrowserModule} from "@angular/platform-browser";
PlotlyModule.plotlyjs = PlotlyJS;

// import {BrowserModule} from "@angular/platform-browser";

@NgModule({

  imports: [
   BrowserAnimationsModule,
     BrowserModule,

    CommonModule,
    PlotlyModule,
    MatSliderModule

  ],
 declarations: [],
  bootstrap: [] //
  // other configurations
})
export class AppModule { }
