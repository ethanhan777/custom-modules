import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';

import { convertToHumanType } from '../../services/common.service';

export const savedBooksSelector = 'saved-books';

@Component({
  selector: savedBooksSelector,
  templateUrl: './saved-books.component.html',
})
export class SavedBooksComponent implements OnInit, OnChanges {
  @Input() status = {};
  displayFlag = false;
  numberOfBooks = 0;
  profiles = [];
  books = [];

  ngOnInit() {
    this.loadItemsFromStorage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.status && changes.status.previousValue) {
      const status: SimpleChange = changes.status;
      this.status = status.currentValue;
      this.loadItemsFromStorage();
    }
  }

  loadItemsFromStorage() {
    this.numberOfBooks = 0;
    this.profiles = [];
    this.books = [];

    const savedData = localStorage.getItem('prhc-saved-books');
    const items = JSON.parse(savedData);

    // adding profile tag to isbn
    if (items) {
      // tslint:disable-next-line:forin
      for (const isbn in items) {
        if (this.books.length < 6) {
          this.books.push(items[isbn]);
        }

        this.profiles = this.profiles.concat(items[isbn].profileTag);
        this.numberOfBooks++;
      }

      // removing duplicated profile tags.
      this.profiles = this.profiles.filter((elem, pos, arr) => arr.indexOf(elem) === pos);

      const humanReadableProfiles = [];
      this.profiles.map(profile => {
        profile = convertToHumanType(profile).toLowerCase();
        if (profile === 'you') {
          profile = 'yourself';
        }
        // make sure there are no duplicates
        if (humanReadableProfiles.indexOf(profile) <= -1) {
          humanReadableProfiles.push(profile);
        }
      });

      this.profiles = humanReadableProfiles;
    }

    this.displayFlag = !(this.books.length < 1);
  }
}
