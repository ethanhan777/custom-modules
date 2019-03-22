import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';
import { EnhancedApiService, getCurrentContentInfo } from '../../services/enhanced_api.service';

export const eventListByAuthorAccordionSelector = 'event-list-by-author-accordion';

@Component({
  selector: eventListByAuthorAccordionSelector,
  templateUrl: './event-list-by-author-accordion.component.html',
})
@Injectable()
export class EventListByAuthorAccordionComponent implements OnInit {
  accordion: any;
  data: any;
  events = [];
  viewAllFlag = false;
  viewAllUrl = '/events';

  constructor ( private enhanced: EnhancedApiService) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();

    if (currentContentInfo.type === 'events') {
      this.enhanced
        .getAuthorEvents(currentContentInfo.type)
        .subscribe(response => {
          if (response) {
            // set accordion.
            this.accordion = {
              id: 'events',
              heading: response.heading,
              toggle: false,
              chevron: 'chevron-down',
            };
            this.data = response;
            this.events = response.events.data;
          }
        });
    } else {
      // set accordion.
      this.accordion = {
        id: 'events',
        heading: 'Events',
        toggle: false,
        chevron: 'chevron-down',
      };
      this.enhanced
        .getAuthorEvents(currentContentInfo.type)
        .subscribe(response => {
          if (response) {
            this.data = response;
            this.events = response.events.data;
          }
        });
    }
  }

  /**
   * Toggle the accordion on click
   *
   * @param {$event} accordion header click event.
   * @param {accordion} Accordion interface object.
   */
  accordionOpen(accordion) {
    accordionOpen(accordion);
  }
}
