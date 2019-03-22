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
import { getFormattedDateWithDay } from '../../services/date_format.service';
// import { formatDate } from '../../services/date_format.service';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

export const eventDetailsSelector = 'event-details';

@Component({
  selector: eventDetailsSelector,
  templateUrl: './event-details.component.html',
})
@Injectable()
export class EventDetailsComponent implements OnInit, OnDestroy {
  isLoaded = false;
  currentEvent: any;
  links = [];
  private subscriptions = new Subscriber();

  constructor(
    private enhanced: EnhancedApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();
    this.subscriptions.add(
      this.enhanced
      .getEvent(currentContentInfo.id)
      .subscribe(response => {
        if (response.data && response.data.length) {
          response.data.map(content => {
            this.enhanced.getEventLinks(content);
            this.currentEvent = {
              // date: formatDate(content.eventDate),
              date: content.eventDate,
              time: content.eventTime,
              description: content.description,
              location: content.location,
              city: content.city,
              state: content.state,
              links: content.links,
            };
            if (this.currentEvent.date) {
              this.currentEvent.date = getFormattedDateWithDay(this.currentEvent.date);
            }
          });
        }
        // set isLoaded flag
          this.isLoaded = true;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  buttonOnClick(buttonLabel?) {
    this.tealium.track('link', {
      'module_type': 'events',
      'module_variation': buttonLabel,
    });
  }
}
