import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'mlcl-hero-series',
  templateUrl: './mlcl-hero-series.component.html',
})
export class MlclHeroSeriesComponent {
  @Input() series;
}
