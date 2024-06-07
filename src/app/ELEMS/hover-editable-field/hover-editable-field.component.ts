import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {CurrencyPipe, DecimalPipe, NgIf, NgStyle, PercentPipe} from "@angular/common";


@Component({
  selector: 'app-hover-editable-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgStyle
  ],
  templateUrl: './hover-editable-field.component.html',
  styleUrl: './hover-editable-field.component.scss'
})
export class HoverEditableFieldComponent implements OnInit, OnDestroy {

  isHovering: boolean = false;
  isFocused: boolean = false;

  @Input() inputMaxWidth: number = 60

  @Input() valueControl!: FormControl;
  @Input() limits: number[] = [0, 1]

  @Input() format: 'currency' |'number' | null = 'number';


  private hoverTimer: any = null;
  formattedValue: string | null = null;

  @Input()  timeOut: number = 200
  constructor(private currencyPipe: CurrencyPipe, private decimalPipe: DecimalPipe) {}

  ngOnInit(): void {
    this.valueControl.valueChanges.subscribe(value => {
      this.updateFormattedValue(value);
    });
    this.updateFormattedValue(this.valueControl.value); // Initial formatting
  }

  private updateFormattedValue(value: any) {
    if (value === null || value === undefined) {
      this.formattedValue = null;
      this.isHovering = false
      return;
    }

    switch (this.format) {
      case 'currency':
        this.formattedValue = this.currencyPipe.transform(value, 'USD', 'symbol', '1.0-0', 'en-US');
        break;

      case 'number':
        this.formattedValue = this.decimalPipe.transform(value, '1.0-2', 'en-US');
        break;
      default:
        this.formattedValue = value; // No formatting
        break;
    }
    this.isHovering = false

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
