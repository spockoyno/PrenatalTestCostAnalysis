import {Component, OnInit} from '@angular/core';


import { NgIf} from "@angular/common";

import {InputsComponent} from "./inputs/inputs.component";
import {OutputsComponent} from "./outputs/outputs.component";

import {PriceScenarioPlotComponent} from "./price-scenario-plot/price-scenario-plot.component";
import {SimulationInputsComponent} from "./simulation-inputs/simulation-inputs.component";
import {SimulationOutputComponent} from "./simulation-output/simulation-output.component";

import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormBuilder, FormControl,  ReactiveFormsModule} from "@angular/forms";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ InputsComponent, OutputsComponent, PriceScenarioPlotComponent, SimulationInputsComponent, SimulationOutputComponent, PriceScenarioPlotComponent,  MatButtonToggleGroup, MatButtonToggle, ReactiveFormsModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  switches: FormControl =
    this.fb.control(['rows','sensitivity', 'simulation'])



  orient=  this.fb.nonNullable.control(['rows'])


  constructor(private fb: FormBuilder) {}

  ngOnInit() {

  }




}
