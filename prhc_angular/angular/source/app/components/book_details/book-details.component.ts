import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import {
  setPublisher,
  setCategories,
} from '../../services/enhanced_api.service';
import { accordionOpen } from '../../services/accordion.service';

export const bookDetailsSelector = 'book-details';

@Component({
  selector: bookDetailsSelector,
  templateUrl: './book-details.component.html',
})
export class BookDetailsComponent implements OnInit, OnChanges {
  @Input() book: any;
  categories: any[];
  publishers: any[];
  audioLengthHours;
  audioLengthMinutes;
  ageRange;
  accordion = {
    id: 'book-details',
    heading: 'Book Details',
    toggle: false,
    chevron: 'chevron-down',
  };
  isLoaded = false;

  ngOnInit() {
    if (this.book) {
      // parse publisher
      if (this.book.imprint) {
        this.publishers = setPublisher(this.book.imprint);
      }

      // parse categories
      if (this.book.categories) {
        this.categories = setCategories(this.book.categories);
      }

      // parse length of audiobook
      if (this.book.audioLength) {
        this.audioLengthHours = Math.floor(this.book.audioLength / 60);
        this.audioLengthMinutes = this.book.audioLength % 60;
      }

      if (this.book.ageRange) {
        this.ageRange = this.book.ageRange.description;
      }

      // set isLoaded flag
      this.isLoaded = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.book && changes.book.previousValue) {
      const newBook: SimpleChange = changes.book;
      const book = newBook.currentValue;

      // parse publisher
      if (book.imprint) {
        this.publishers = setPublisher(book.imprint);
      }

      // parse categories
      if (book.categories) {
        this.categories = setCategories(book.categories);
      }

      // parse length of audiobook
      if (book.audioLength) {
        this.audioLengthHours = Math.floor(book.audioLength / 60);
        this.audioLengthMinutes = book.audioLength % 60;
      }

      if (book.ageRange) {
        this.ageRange = book.ageRange.description;
      }
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
