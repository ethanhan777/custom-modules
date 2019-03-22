import { Component, Input } from '@angular/core';

@Component({
  selector: 'atm-subheading',
  templateUrl: './atm-subheading.component.html',
})
export class AtmSubheadingComponent {
  @Input() subheading: string;
}
