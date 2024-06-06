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
  @Input() currencyCode: string = 'USD'; // Default to USD, adjust as needed
  @Input() locale: string = 'en-US'; // Default locale, adjust as needed



  formattedValue: string | null = null;

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
      return;
    }

    switch (this.format) {
      case 'currency':
        this.formattedValue = this.currencyPipe.transform(value, this.currencyCode, 'symbol', '1.2-2', this.locale);
        break;
      case 'percent':
        this.formattedValue = this.percentPipe.transform(value, '1.2-2', this.locale);
        break;
      case 'number':
        this.formattedValue = this.decimalPipe.transform(value, '1.0-2', this.locale);
        break;
      default:
        this.formattedValue = value; // No formatting
        break;
    }

  }


 //
 // getMaxWidth (): string {
 //
 //
 //    console.log(`${ this.inputMaxWidth } px`)
 //   console.log(this.inputMaxWidth )
 //
 //    return  `${this.inputMaxWidth}px`
 //
 // }

  handleFocus() {
    this.isFocused = true;
  }

  handleBlur() {
    this.isFocused = false;
    this.isHovering = false;
  }

  handleMouseEnter() {
    this.isHovering = true;
  }

  handleMouseLeave() {
    if (!this.isFocused) {
      this.isHovering = false;
    }
  }
}
