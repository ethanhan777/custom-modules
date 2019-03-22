import {
  Component,
  OnInit,
  OnDestroy,
  Injectable,
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';
  import { Subscriber } from 'rxjs/Subscriber';

export const eventListByLocaitonSelector = 'event-list-by-location';

@Component({
  selector: eventListByLocaitonSelector,
  templateUrl: './event-list-by-location.component.html',
})
@Injectable()
export class EventListByLocationComponent implements OnInit, OnDestroy {
  events = [];
  currentLocation = undefined;
  loading = false;
  loadMoreFlag = false;
  start = 0;
  viewAllFlag = false;
  private subscriptions = new Subscriber();
  currentContentInfo = getCurrentContentInfo();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    let options = {};
    if (isNaN(Number(this.currentContentInfo.id))) {
      this.currentLocation = this.currentContentInfo.id;
      options = {location: this.currentLocation};
    } else {
      options = {byContentType: this.currentContentInfo.type};
    }

    this.subscriptions.add(
      this.enhanced
        .getEvents(options)
        .subscribe(response => {
          if (response.data && response.data.length) {
            this.events = response.data;
          }
          this.loadMoreFlag = response.recordCount > this.events.length;
          this.viewAllFlag = response.recordCount > this.events.length;
          this.currentLocation = response.data[0].state;
        })
    );
    // this.currentLocation = 'AB';
  }

  loadEvents() {
    this.start += 10;
    this.loading = true;
    this.loadMoreFlag = false;

    this.subscriptions.add(
      this.enhanced
        .getEvents({
          // byContentType: currentContentInfo.type,
          location: this.currentLocation,
          next: this.start,
        })
        .subscribe(response => {
          if (response.data && response.data.length) {
            response.data.map(event => {
              this.events.push(event);
            });

          }
          this.loadMoreFlag = response.recordCount > this.events.length;
          this.loading = false;
          // this.currentLocation = response.data[0].state;
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
