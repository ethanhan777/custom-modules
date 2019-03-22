import {
  Component,
  Injectable,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo,
  parseFrontlistiestWorkForCategory,
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const newReleaseSelector = 'new-release';

@Component({
  selector: newReleaseSelector,
  templateUrl: './new-release.component.html',
})
@Injectable()
export class NewReleaseComponent implements OnInit, OnDestroy {
  data = [];
  isLoaded = false;
  private subscriptions = new Subscriber();
   @Output() hasNewRelease = new EventEmitter<any>();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();

    // separate data for imprints
    if (currentContentInfo.type === 'imprints') {
      this.subscriptions.add(
        this.enhanced
          .getNewReleasesImprints({imprintCode: currentContentInfo.id})
          .subscribe(response => {
            this.data = response.data;
            this.isLoaded = this.data.length > 0;
            this.hasNewRelease.emit(this.isLoaded);
          })
      );
    } else if (currentContentInfo.type === 'categories') {
      this.subscriptions.add(
        this.enhanced
          .getNewReleaseCategory(currentContentInfo.id, { usDivision: true })
          .map(response => parseFrontlistiestWorkForCategory(response, currentContentInfo.id))
          .subscribe(response => {
            this.data = response.data;
            this.isLoaded = this.data.length > 0;
          })
      );
    } else {
      // everthing that is not an imprint
      this.subscriptions.add(
        this.enhanced
          .getNewReleases()
          .subscribe(response => {
            if (response.data && response.data.length) {
              response.data.map(work => {
                this.data.push(work);
              });
              // ready to render data
              this.isLoaded = this.data.length > 0;
            }
          })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
