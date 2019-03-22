import {
  Component,
  OnInit,
  OnDestroy,
  Injectable,
  Input
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { EnhancedApiService } from '../../services/enhanced_api.service';

export const eventListSelector = 'event-list';

@Component({
  selector: eventListSelector,
  templateUrl: './event-list.component.html',
})
@Injectable()
export class EventListComponent implements OnInit, OnDestroy {
  @Input() heading: string;
  @Input() events;
  viewAllFlag = false;
  viewAllUrl = '/events';
  noResultFlag = false;
  data = [];
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    // set heading
    this.heading = this.heading ? this.heading : 'Author Events This Week';
    this.loadEvents();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * load events
   */
  loadEvents() {
    // if events are passed from parent component, use it
    if (this.events && this.events.length) {
      this.data = this.events;

      this.viewAllFlag = this.events.length >= 10 ? true : false;
      this.isLoaded = true;
    } else {
      this.subscriptions.add(
        this.enhanced
          .getEvents({ nextWeek: true })
          .subscribe(response => {
            if (response.data && response.data.length) {
              response.data.map(event => {
                this.data.push(event);
              });

              // force to render view all button
              this.viewAllFlag = true;
              this.isLoaded = this.data.length > 0;
            } else {
              this.noResultFlag = true;
              this.isLoaded = true;
            }
          })
      );
    }
  }

  /**
   * redirect to sub page.
   *
   * @param {flag} signal flag from atm_button_alt component if the button is clicked.
   */
  redirect(flag) {
    if (flag) {
      window.location.href = this.viewAllUrl;
    }
  }
}
