import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButton} from "@angular/material/button";

import {AsyncPipe} from "@angular/common";

import {InputsComponent} from "./inputs/inputs.component";
import {OutputsComponent} from "./outputs/outputs.component";

import {PriceScenarioPlotComponent} from "./price-scenario-plot/price-scenario-plot.component";
import {SimulationInputsComponent} from "./simulation-inputs/simulation-inputs.component";
import {SimulationOutputComponent} from "./simulation-output/simulation-output.component";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButton, AsyncPipe, InputsComponent, OutputsComponent, PriceScenarioPlotComponent, SimulationInputsComponent, SimulationOutputComponent, PriceScenarioPlotComponent, MatDivider],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {





}
