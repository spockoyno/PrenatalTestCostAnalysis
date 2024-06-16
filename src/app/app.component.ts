import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButton} from "@angular/material/button";

import {AsyncPipe, NgIf} from "@angular/common";

import {InputsComponent} from "./inputs/inputs.component";
import {OutputsComponent} from "./outputs/outputs.component";

import {PriceScenarioPlotComponent} from "./price-scenario-plot/price-scenario-plot.component";
import {SimulationInputsComponent} from "./simulation-inputs/simulation-inputs.component";
import {SimulationOutputComponent} from "./simulation-output/simulation-output.component";
import {MatDivider} from "@angular/material/divider";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {F} from "@angular/cdk/keycodes";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {OutputCostsPregnancyComponent} from "./output-costs-pregnancy/output-costs-pregnancy.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButton, AsyncPipe, InputsComponent, OutputsComponent, PriceScenarioPlotComponent, SimulationInputsComponent, SimulationOutputComponent, PriceScenarioPlotComponent, MatDivider, MatButtonToggleGroup, MatButtonToggle, ReactiveFormsModule, NgIf, MatFormField, MatLabel, MatOption, MatSelect, OutputCostsPregnancyComponent],
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
