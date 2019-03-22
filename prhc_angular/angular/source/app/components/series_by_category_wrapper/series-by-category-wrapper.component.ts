import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';

export const seriesByCategoryWrapperSelector = 'series-by-category-wrapper';

@Component({
  selector: seriesByCategoryWrapperSelector,
  templateUrl: './series-by-category-wrapper.component.html',
})
@Injectable()
export class SeriesByCategoryWrapperComponent implements OnInit {
  ignoreSeriesCode: string;
  categories = [];

  constructor (private enhacned: EnhancedApiService) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();
    this.ignoreSeriesCode = currentContentInfo.id;
    this.enhacned.getSeriesByCategory(currentContentInfo.type)
      .subscribe(response => {
        if (response['data'] && response['data'].length) {
          response['data'].map(category => {
            if (this.categories.length < 2) {
              this.categories.push(category);
            }
          });
        }
      });
  }
}
