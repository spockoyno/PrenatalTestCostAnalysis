import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CurrencyPipe, DecimalPipe, NgIf, NgStyle, PercentPipe} from "@angular/common";
import {round2} from "../../DOMAIN/logic";

@Component({
  selector: 'app-hover-editable-percent',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgStyle
  ],
  templateUrl: './hover-editable-percent.component.html',
  styleUrl: './hover-editable-percent.component.scss'
})
export class HoverEditablePercentComponent implements OnInit, OnDestroy{

  isHovering: boolean = false;
  isFocused: boolean = false;

  @Input() inputMaxWidth: number = 60

  @Input() valueControl!: FormControl;
  @Input() limitsPercent: number[] = [0.2, 100]

 myControl: FormControl = new FormControl(0.1)

  private hoverTimer: any = null;
  formattedValue: string | null = null;

  @Input()  timeOut: number = 200
  constructor( private percentPipe: PercentPipe) {}

  ngOnInit(): void {

    // When the external control changes, update the local display control
    this.valueControl.valueChanges.subscribe(value => {
      this.updateFormattedValue(value);
      this.myControl.setValue(value * 100, { emitEvent: false }); // Prevents feedback loop
    });


    this.myControl.valueChanges.subscribe(value => {
      this.valueControl.setValue(round2(value / 100)); // Scale back to 0-1
    });



    this.updateFormattedValue(this.valueControl.value); // Initial formatting
    this.myControl.setValue(this.valueControl.value * 100);
  }

  private updateFormattedValue(value: any) {

    this.isHovering = false

    if (value === null || value === undefined) {
      this.formattedValue = null;
    }
    else {this.formattedValue = this.percentPipe.transform(value, '1.0-0', 'en-US');}

  }




  handleFocus() {
    this.isFocused = true;
  }

  handleBlur() {
    this.isFocused = false;
    this.isHovering = false;
  }

  handleMouseEnter() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
    }

    // Set a new timer
    this.hoverTimer = setTimeout(() => {
      this.isHovering = true;
    }, this.timeOut);
  }

  handleMouseLeave() {
    this.isHovering = false;

    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }



  }

  ngOnDestroy() {
    // Make sure to clear the timer when the component is destroyed
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
    }
  }

}
