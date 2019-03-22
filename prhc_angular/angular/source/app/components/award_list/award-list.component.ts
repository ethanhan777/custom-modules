import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';
import { parseBookAwards } from '../../services/enhanced_api.service';

export const awardListSelector = 'award-list';

@Component({
  selector: awardListSelector,
  templateUrl: './award-list.component.html',
})
export class AwardListComponent implements OnInit {
  @Input() awards: any;
  parsedAwards = [];
  accordion: any;

  ngOnInit() {
    // set accordion
    this.accordion = {
      id: 'awards',
      heading: 'Awards',
      toggle: false,
      chevron: 'chevron-down',
    };

    if (this.awards) {
      this.awards = parseBookAwards(this.awards);
      this.awards.map(award => {
        if (award.level !== 'SUBMITTED') {
          this.parsedAwards.push(award);
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
