import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
} from '@angular/core';
import {
  EnhancedApiService
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

export const seriesPageSelector = 'series-page';

@Component({
  selector: seriesPageSelector,
  templateUrl: './series-page.component.html',
})
@Injectable()
export class SeriesPageComponent implements OnInit, OnDestroy {
  series: any;
  private subscriptions = new Subscriber();

  constructor(
    private enhanced: EnhancedApiService,
    private tealium: TealiumUtagService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.enhanced
        .getSeries()
        .subscribe(response => {
          if (response['data'] && response['data'].length) {
            this.series = response['data'][0];
            this.sendTealiumData(this.series);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendTealiumData(series) {
    this.tealium.track('view', {
      'page_type': 'series',
      'page_name': series.seriesName,
    });
  }
}
