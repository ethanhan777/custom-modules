import {
  Component,
  OnInit
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';
import {
  EnhancedApiService,
  getCurrentContentInfo,
  parseClientAuthors
} from '../../services/enhanced_api.service';

export const booksByAuthorAccordionSelector = 'books-by-author-accordion';

@Component({
  selector: booksByAuthorAccordionSelector,
  templateUrl: './books-by-author-accordion.component.html',
})
export class BooksByAuthorAccordionComponent implements OnInit {
  accordion  = {
    id: 'books-by-author',
    heading: 'Books by ',
    toggle: true,
    chevron: 'chevron-up',
  };
  author: any;
  authorWorks = [];
  authorSeries = [];
  contribWorks = [];
  clientAuthors = [];

  constructor ( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();
    this.enhanced.getAuthor(currentContentInfo.id, 'display')
      .subscribe(response => {
        if (response['data'] && response['data'][0]) {
          this.author = response['data'][0];
          this.accordion.heading += this.author.display;
          this.clientAuthors = parseClientAuthors(this.author.clientAuthors);
        }
      });

    this.enhanced.getAuthor(currentContentInfo.id, 'works')
      .subscribe(response => {
        if (response['data'] && response['data'][0]) {
          this.authorWorks = response['data'];
        }
      });

    this.enhanced.getAuthor(currentContentInfo.id, 'series')
      .subscribe(response => {
        if (response['data'] && response['data'][0]) {
          this.authorSeries = response['data'];
        }
      });

    this.enhanced.getAuthor(currentContentInfo.id, 'works', {ignoreContribRole: true})
      .subscribe(response => {
        if (response['data'] && response['data'][0]) {
          this.contribWorks = response['data'];
        }
      });
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
