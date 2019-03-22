import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { getProvinceName } from '../../services/common.service';
import { accordionOpen } from '../../services/accordion.service';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';

@Component({
  selector: 'mlcl-event-list-accordion',
  templateUrl: './mlcl-event-list-accordion.component.html',
})
export class MlclEventListAccordionComponent implements OnInit {
  @Input() location: string;
  @Input() events = [];
  @Input() loading = false;
  @Input() viewAllFlag = false;
  @Input() loadMoreFlag = false;
  @Input() accordionToggle = false;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() loadEventFlag = new EventEmitter<any>();
  viewAllUrl = '/events';
  buttonLabel = 'View All Events';
  accordion = {
    id: '',
    heading: '',
    toggle: false,
    chevron: 'chevron-down',
  };

  ngOnInit() {
    this.setProvinceName(this.location);
    // check accorion toggle. if true, open it by default
    if (this.accordion.toggle) {
      // load event data
      this.loadEventFlag.emit(this.location);
    }
  }

  setProvinceName(location) {
    const currentContentInfo = getCurrentContentInfo();
    const provinceName = getProvinceName(location);
    this.accordion = {
      id: 'events-' + location,
      heading: 'Author Events in ' + provinceName,
      toggle: this.accordionToggle,
      chevron: this.accordionToggle ? 'chevron-up' : 'chevron-down',
    };

    if (!currentContentInfo.id) {
      this.accordion.heading = provinceName;
    }

    // set view all button's url
    this.viewAllUrl +=
      '/' +
      location +
      '/' +
      provinceName
        .toLowerCase()
        .split(' ')
        .join('-') +
      '/location';
  }

  /**
   * redirect to sub page.
   *
   * @param {flag} signal flag from atm_button_alt component if the button is clicked.
   */
  redirect() {
    if (this.loadMoreFlag) {
      this.loadEventFlag.emit(this.location);
    } else {
      window.location.href = this.viewAllUrl;
    }
  }

  /**
   * Toggle the accordion on click
   *
   * @param {$event} accordion header click event.
   * @param {accordion} Accordion interface object.
   */
  accordionOpen() {
    accordionOpen(this.accordion);
    this.loadEventFlag.emit(this.location);
  }
}
