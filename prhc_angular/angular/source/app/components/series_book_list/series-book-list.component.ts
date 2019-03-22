import {
  Component,
  OnInit,
  Injectable,
  OnDestroy
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const seriesBookListSelector = 'series-book-list';

@Component({
  selector: seriesBookListSelector,
  templateUrl: './series-book-list.component.html',
})
@Injectable()
export class SeriesBookListComponent implements OnInit, OnDestroy {
  listCounter = 0;
  heading: string;
  headingForNumbered: string;
  worksForNumbered = [];
  works = [];
  currentContentInfo = getCurrentContentInfo();
  loading = false;
  loadMoreFlagForNumbered = false;
  loadMoreFlag = false;
  start = 0;
  rows = 32;
  sortOptions = {};
  private subscriptions = new Subscriber();

  constructor (private enhanced: EnhancedApiService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.enhanced
        .getTitleSeriesWorks({hasSeriesNumber: true})
        .subscribe(response => {
          if (response.works && response.works.length) {
            response.works.map(work => {
              if (work.seriesNumber) {
                work.label = 'Book ' + work.seriesNumber;
              }
              this.worksForNumbered.push(work);
            });
          }

          this.loadMoreFlagForNumbered = response.recordCount > this.worksForNumbered.length;
          this.updateHeading(response.headingTag.name);
        })
    );

    this.subscriptions.add(
      this.enhanced
        .getTitleSeriesWorks({hasSeriesNumber: false})
        .subscribe(response => {
          if (response.works && response.works.length) {
            this.works = response.works;
          }
          this.loadMoreFlag = response.recordCount > this.works.length;
          this.updateHeading(response.headingTag.name);
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sort(sortOptions, hasSeriesNumber) {
    this.loading = true;
    this.start = 0;
    this.sortOptions = sortOptions;

    this.subscriptions.add(
      this.enhanced
        .getTitleSeriesWorks({
          hasSeriesNumber: hasSeriesNumber,
          next: this.start,
          sort: this.sortOptions,
        })
        .subscribe(response => {
          if (response.works && response.works.length) {
            if (hasSeriesNumber) {
              this.worksForNumbered = [];
              response.works.map(work => {
                if (work.seriesNumber) {
                  work.label = 'Book ' + work.seriesNumber;
                }
                this.worksForNumbered.push(work);
              });

              this.loadMoreFlagForNumbered = response.recordCount > this.worksForNumbered.length;
            } else {
              this.works = [];
              this.works = response.works;
              this.loadMoreFlag = response.recordCount > this.works.length;
            }
          }
          this.loading = false;
        })
    );
  }

  loadMore(hasSeriesNumber) {
    this.loading = true;
    this.start = this.start + this.rows;
    this.subscriptions.add(
      this.enhanced
        .getTitleSeriesWorks({
          hasSeriesNumber: hasSeriesNumber,
          next: this.start,
          sort: this.sortOptions,
        })
        .subscribe(response => {
          if (response.works && response.works.length) {
            response.works.map(work => {
              if (hasSeriesNumber) {
                if (work.seriesNumber) {
                  work.label = 'Book ' + work.seriesNumber;
                }
                this.worksForNumbered.push(work);
              } else {
                this.works.push(work);
              }
            });
          }

          if (hasSeriesNumber) {
            this.loadMoreFlagForNumbered = response.recordCount > this.worksForNumbered.length;
          } else {
            this.loadMoreFlag = response.recordCount > this.works.length;
          }

          this.loading = false;
        })
    );
  }

  /**
   * check if both series with number and non-numbered exist.
   */
  updateHeading(heading) {
    this.heading = heading;
    this.headingForNumbered = heading;
    if (
      this.works.length &&
        this.worksForNumbered.length
      ) {
      this.heading = 'More from ' + this.heading;
    }
  }
}
