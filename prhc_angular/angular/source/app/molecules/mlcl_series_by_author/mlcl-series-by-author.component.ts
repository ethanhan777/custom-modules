import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  parseSeriesSliderItem,
  EnhancedApiService
} from '../../services/enhanced_api.service';

@Component({
  selector: 'mlcl-series-by-author',
  templateUrl: './mlcl-series-by-author.component.html',
})
export class MlclSeriesByAuthorComponent implements OnInit {
  @Input() heading: string;
  @Input() series = [];
  @Input() authorId: string;

  constructor (private enhanced: EnhancedApiService) {}

  ngOnInit() {
    this.heading = 'Series with ' + this.heading;

    if (this.series.length) {
      this.series.map(parseSeriesSliderItem);
    } else if (this.authorId) {
      this.enhanced.getAuthor(this.authorId, 'series')
        .subscribe(response => {
          if (response['data'] && response['data'].length) {
            this.series = response['data'].map(parseSeriesSliderItem);
          }
        });
    }
  }
}
