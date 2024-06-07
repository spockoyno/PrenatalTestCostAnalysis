import {Component, OnInit} from '@angular/core';
import {InteractorService} from "../CORE/interactor.service";
import {MatLabel} from "@angular/material/form-field";
import {MatSlider, MatSliderModule, MatSliderThumb} from "@angular/material/slider";
import {FormBuilder, FormControl,  FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CurrencyPipe, DecimalPipe, NgIf, PercentPipe} from "@angular/common";
import {MatButton, MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableModule
} from '@angular/material/table';
import {MatIcon} from "@angular/material/icon";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatTooltip} from "@angular/material/tooltip";
import {HoverEditableFieldComponent} from "../hover-editable-field/hover-editable-field.component";

export interface SensitivityInputRow{
  inputName: string;
   control: FormControl<number>;
  pipeType: string;
 min: number;
 max: number;
 step: number;

}


@Component({
  selector: 'app-inputs',
  standalone: true,
  imports: [
    MatLabel,
    MatSlider,
    MatSliderModule,
    ReactiveFormsModule,
    FormsModule,
    MatSliderThumb,
    PercentPipe,
    CurrencyPipe,
    MatButton,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef,
    NgIf,
    MatHeaderRowDef,
    MatFabButton,
    MatMiniFabButton,
    MatIcon,
    MatIconButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardFooter,
    MatTooltip,
    HoverEditableFieldComponent
  ],
  providers: [CurrencyPipe, PercentPipe, DecimalPipe],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.scss'
})




export class InputsComponent  implements OnInit{

  columnNames = ["Variable", "Input", "Value" ]

 public table : SensitivityInputRow[]




public form = this.fb.nonNullable.group({
      ratePaternalFollowUp: 0,
  rateReferralMFM: 0,
  costPaternalTesting: 0,
  costMFM: 0
  })
  constructor(public inter: InteractorService, public fb: FormBuilder) {

    this.table = [
      {inputName: "Paternal Follow-up Rate", control: this.form.controls.ratePaternalFollowUp,
        pipeType: "%", min: 0.002, max: 1, step: 0.002
      },
      {inputName: "MFM Referral Rate", control: this.form.controls.rateReferralMFM,
        pipeType: "%", min: 0, max: 1, step: 0.002
      },
  {inputName: "Parental Testing Cost", control: this.form.controls.costPaternalTesting,
        pipeType: "$", min: 0, max: 5000, step: 1
      },
 {inputName: "MFM Cost", control: this.form.controls.costMFM,
        pipeType: "$", min: 0, max: 15000, step: 1
      }



    ]



    this.ngOnInit()
  }

    ngOnInit() {

    this.form.setValue( this.inter.initialInput)
     this.form.valueChanges.subscribe(x => this.inter.newUserInputs(this.form.getRawValue()))



  }



  resetClick() {

        this.form.setValue( this.inter.initialInput)

  }

}
