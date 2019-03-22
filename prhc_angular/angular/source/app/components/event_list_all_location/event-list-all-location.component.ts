import {
  Component,
  OnInit,
  OnDestroy,
  Injectable,
} from '@angular/core';
import { EnhancedApiService } from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const eventListAllLocaitonSelector = 'event-list-all-location';

@Component({
  selector: eventListAllLocaitonSelector,
  templateUrl: './event-list-all-location.component.html',
})
@Injectable()
export class EventListAllLocationComponent implements OnInit, OnDestroy {
  provinces = [
    'AB',
    'BC',
    'MB',
    'NB',
    'NL',
    'NS',
    'NT',
    'NU',
    'ON',
    'PE',
    'QC',
    'SK',
    'YT',
  ];
  events = [];
  // loading = false;
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    this.provinces.map(province => {
      this.events[province] = {
        events: [],
        viewAllFlag: false,
        loading: false,
      };
    });

  }

  loadEvents(location) {
    this.events[location].loading = true;
    let eventList = [];

    if (this.events[location].events.length <= 0) {
      this.subscriptions.add(
        this.enhanced.getEvents({ location: location })
          .subscribe(response => {
            if (response.data && response.data.length) {
              eventList = response.data;
            }
            this.events[location] = {
              events: eventList,
              viewAllFlag: response.recordCount > response.data.length,
            };
            this.events[location].loading = false;
          })
      );
    }
    this.events[location].loading = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
