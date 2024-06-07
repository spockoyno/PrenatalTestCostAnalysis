import {Component, Input, OnInit} from '@angular/core';
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
export class HoverEditableFieldComponent implements OnInit {

  isHovering: boolean = false;
  isFocused: boolean = false;

  @Input() inputMaxWidth: number = 60

  @Input() valueControl!: FormControl;
  @Input() limits: number[] = [0, 1]

  @Input() format: 'currency' | 'percent' | 'number' | null = 'number';


  private hoverTimer: any = null;
  formattedValue: string | null = null;

  timeOut: number = 200
  constructor(private currencyPipe: CurrencyPipe, private percentPipe: PercentPipe, private decimalPipe: DecimalPipe) {}

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
      case 'percent':
        this.formattedValue = this.percentPipe.transform(value, '1.2-2', 'en-US');
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

      // this.isHovering = false;

  }
}
