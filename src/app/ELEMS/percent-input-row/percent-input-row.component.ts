import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-percent-input-row',
  standalone: true,
  imports: [],
  templateUrl: './percent-input-row.component.html',
  styleUrl: './percent-input-row.component.scss'
})
export class PercentInputRowComponent {


  pipeType: string = "%"
  step: number = 0.002
  limits: number[] = [0, 1]

 name: string


control: FormControl

  constructor(name: string, control: FormControl) {
    this.name = name
    this.control = control
  }

}
