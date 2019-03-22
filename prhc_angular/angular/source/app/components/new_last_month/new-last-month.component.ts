import {
  Component,
  OnInit,
  OnDestroy,
  Injectable,
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { EnhancedApiService } from '../../services/enhanced_api.service';

export const newLastMonthSelector = 'new-last-month';

@Component({
  selector: newLastMonthSelector,
  templateUrl: './new-last-month.component.html',
})
@Injectable()
export class NewLastMonthComponent implements OnInit, OnDestroy {
  data = [];
  isLoaded = false;
  loading = false;
  loadMoreFlag = false;
  private rows = 32;
  private options = {
    sort: { name: 'onsale', dir: 'desc' },
    next: 0,
  };
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    // set filters for child component
    const request = this.enhanced.getNewReleases('last-month');
    this.subscribeRequest(request);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sort(sortOption) {
    this.loading = true;
    this.data = [];
    this.options.sort = sortOption;
    this.options.next = 0;

    const request = this.enhanced.getNewReleases('last-month', this.options);
    this.subscribeRequest(request);
  }

  loadMore() {
    this.loadMoreFlag = false;
    this.loading = true;
    this.options.next = this.options.next + this.rows;

    const request = this.enhanced.getNewReleases('last-month', this.options);
    this.subscribeRequest(request);
  }

  subscribeRequest(request) {
    this.subscriptions.add(
      request.subscribe(response => {
        if (response.data && response.data.length) {
          response.data.map(work => {
            this.data.push(work);
          });

          if (response.recordCount > this.data.length) {
            this.loadMoreFlag = true;
          }
        }

        this.isLoaded = this.data.length > 0;
        this.loading = false;
      })
    );
  }
}
