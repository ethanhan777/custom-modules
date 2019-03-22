import {
  Component,
  OnInit,
  Input,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';
import { EnhancedApiService } from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const eventListByBookAccordionSelector = 'event-list-by-book-accordion';

@Component({
  selector: eventListByBookAccordionSelector,
  templateUrl: './event-list-by-book-accordion.component.html',
})
@Injectable()
export class EventListByBookAccordionComponent implements OnInit, OnDestroy {
  @Input() contributors = [];
  accordion: any;
  events = [];
  viewAllFlag = false;
  isLoaded = false;
  private viewAllUrl = '/events';
  private subscriptions = new Subscriber();

  constructor ( private enhanced: EnhancedApiService) {}

  ngOnInit() {
    // set accordion.
    this.accordion = {
      id: 'events',
      heading: 'Events',
      toggle: false,
      chevron: 'chevron-down',
    };

    if (this.contributors && this.contributors.length) {
      const contributors = this.contributors
        .filter(contributor => contributor.roleCode === 'A' && contributor.ontour);

      if (contributors  && contributors.length) {
        this.viewAllUrl = contributors[0].seoFriendlyUrl + this.viewAllUrl;
      }
    }

    this.subscriptions.add(
      this.enhanced
        .getEvents({byContentType: 'books'})
        .subscribe(response => {
          if (response.data && response.data.length) {
            this.events = response.data;
            this.viewAllFlag = response.recordCount > response.data.length;
            this.isLoaded = this.events.length > 0;
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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

  redirect() {
    window.location.href = this.viewAllUrl;
  }
}
