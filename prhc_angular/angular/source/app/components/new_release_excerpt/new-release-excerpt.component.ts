import {
  Component,
  OnInit,
  Injectable,
  OnDestroy
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo,
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const newReleaseExcerptSelector = 'new-release-excerpt';

@Component({
  selector: newReleaseExcerptSelector,
  templateUrl: './new-release-excerpt.component.html',
})
@Injectable()
export class NewReleaseExcerptComponent implements OnInit, OnDestroy {
  data = [];
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    const pageType = getCurrentContentInfo().type;
    this.subscriptions.add(
      this.enhanced
      .getNewReleases(pageType)
      .subscribe(response => {
        if (response.data && response.data.length) {
          // add works into works
          response.data.map(work => {
            this.data.push(work);
          });

          // if canadian division works are less than 15, call for
          // US division works.
          if (response.recordCount < 15) {
            this.getUsDivision(pageType);
          } else {
            this.isLoaded = this.data.length > 0;
          }
        } else {
          this.getUsDivision(pageType);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * get works from US divisions.
   */
  getUsDivision(pageType) {
    this.enhanced
    .getNewReleases(pageType, {usDivision: true})
    .subscribe(response => {
      if (response.data && response.data.length) {
        // this.viewAllFlag = this.recordCount > 15;
        // add works into data
        response.data.map(work => {
          if (this.data.length < 15) {
            this.data.push(work);
          }
        });
      }

      // set isLoaded flag
      this.isLoaded = this.data.length > 0;
    });
  }
}
