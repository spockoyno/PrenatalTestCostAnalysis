import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {InteractorService} from "../CORE/interactor.service";
import {MatSlider, MatSliderRangeThumb, MatSliderThumb} from "@angular/material/slider";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {CommonModule, CurrencyPipe, DecimalPipe, NgIf, PercentPipe} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {SimulationInputs, simulationInputs} from "../CORE/model.view";
import {MatInput} from "@angular/material/input";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {SimulationOutputComponent} from "../simulation-output/simulation-output.component";
import {MatIcon} from "@angular/material/icon";
import {MatExpansionPanelTitle} from "@angular/material/expansion";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle
} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {number} from "mathjs";
import {HoverEditableFieldComponent} from "../hover-editable-field/hover-editable-field.component";
import {MatTooltip, TooltipPosition} from "@angular/material/tooltip";


interface RangeRow {
  inputName: string;
  controlMin: FormControl<number>;
  controlMax: FormControl<number>;
  pipeType: string;
  minPhys: number;
  maxPhys: number;
  step: number;
}

interface QuantRow {

  limits: number[];
  sliderInput: FormControl<number>;

}


@Component({
  selector: 'app-simulation-inputs',
  standalone: true,
  imports: [

    ReactiveFormsModule,
    MatSlider,
    MatSliderRangeThumb,
    MatLabel,
    MatSliderThumb,
    PercentPipe,
    CurrencyPipe,
    MatButton,
    MatFormField,
    MatInput,
    MatError,
    NgIf,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    SimulationOutputComponent,
    MatIcon,
    MatIconButton,
    MatExpansionPanelTitle,
    MatCardContent,
    MatCardTitle,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardFooter,
    MatDivider,
    DecimalPipe,
    HoverEditableFieldComponent,
    MatTooltip,

  ],
  templateUrl: './simulation-inputs.component.html',
  styleUrl: './simulation-inputs.component.scss',
  providers: [CurrencyPipe, PercentPipe, DecimalPipe]
})
export class SimulationInputsComponent implements OnInit {



  positionOptions: TooltipPosition[] = ['after']

  controlsForm
  columnNames = ["Variable", "Input", "Min", "Mid", "Max"]
  table: RangeRow[]

  columnsQuantile = ["Draws", "Quantile", "Low", "High"]
  tableQuantitle: QuantRow[]


  form = this.fb.nonNullable.group({
    ratePaternalFollowUpMin: 0,
    ratePaternalFollowUpMax: 1,
    rateReferralMFMin: 0,
    rateReferralMFMax: 1,
    costPaternalTestingMin: 0,
    costPaternalTestingMax: 1,
    costMFMin: 0,
    costMFMax: 1540
  });

  constructor(public fb: FormBuilder, public inter: InteractorService) {




    const ctrl = this.form.controls
    const b = inter.initialIntervals


    this.table = [{
      inputName: "Paternal Follow-up Rate", controlMin: ctrl.ratePaternalFollowUpMin,
      controlMax: ctrl.ratePaternalFollowUpMax,
      pipeType: "%", minPhys: 0.002, maxPhys: 1, step: 0.002
    },

      {
        inputName: "MFM Referral Rate", controlMin: ctrl.rateReferralMFMin,
        controlMax: ctrl.rateReferralMFMax,
        pipeType: "%", minPhys: 0, maxPhys: 1, step: 0.002
      },
      {
        inputName: "Parental Testing Cost", controlMin: ctrl.costPaternalTestingMin,
        controlMax: ctrl.costPaternalTestingMax,
        pipeType: "$", minPhys: 0, maxPhys: 5555, step: 1
      },
      {
        inputName: "MFM Cost", controlMin: ctrl.costMFMin,
        controlMax: ctrl.costMFMax,
        pipeType: "$", minPhys: 0, maxPhys: 10_000, step: 1
      },

    ]
    const simInputs = inter.simInputs$.value

    this.controlsForm = this.fb.nonNullable.group(
      {
        drawsCount: [simInputs.drawsCount, [
          Validators.required,
          Validators.min(1),
          this.positiveIntegerValidator  // Ensures the number is an integer
        ]], quantile: simInputs.quantile
      }
    )


    this.tableQuantitle = [{
      sliderInput: this.controlsForm.controls.quantile,
      limits: [0.01, 0.5]
    }]


    this.ngOnInit()
  }

  ngOnInit() {

    const data = this.inter.userInputIntervals(this.inter.initialIntervals)

    this.form.setValue(data)

    this.controlsForm.controls.quantile.valueChanges.subscribe(d => {
      // @ts-ignore
      this.inter.newSimulationInputs(this.controlsForm.value)
    })


  }


  resetClick() {
    const data = this.inter.userInputIntervals(this.inter.initialIntervals)

    this.form.setValue(data)

  }

  positiveIntegerValidator(control: FormControl) {
    if (control.value != null && !Number.isInteger(control.value)) {
      return {invalidInteger: true};
    }
    return null
  }


  runClick() {


    // @ts-ignore
    this.inter.runSimulation(this.form.getRawValue(), this.controlsForm.getRawValue());


  }
}




