import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';

export const bookPraiseSelector = 'book-praise';

@Component({
  selector: bookPraiseSelector,
  templateUrl: './book-praise.component.html',
})
export class BookPraiseComponent implements OnInit {
  @Input() praise: string;
  accordion: any;

  ngOnInit() {
    this.accordion = {
      id: 'praise',
      heading: 'Praise',
      toggle: false,
      chevron: 'chevron-down',
    };
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
