import {
  Component,
  OnInit,
  Injectable,
  OnDestroy
} from '@angular/core';
import { EnhancedApiService } from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const moreInSeriesSelector = 'more-in-series';

@Component({
  selector: moreInSeriesSelector,
  templateUrl: './more-in-series.component.html',
})
@Injectable()
export class MoreInSeriesComponent implements OnInit, OnDestroy {
  series: any;
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor ( private enhanced: EnhancedApiService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.enhanced.getTitleSeriesWorks()
      .subscribe(response => {
        if (response) {
          this.series = response;
          this.isLoaded = true;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
