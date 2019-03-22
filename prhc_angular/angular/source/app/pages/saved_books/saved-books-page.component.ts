import {
  Component,
  OnInit,
  Injectable,
} from '@angular/core';

import { convertToHumanType } from '../../services/common.service';
import { TealiumUtagService } from '../../services/utag.service';

export const savedBooksSelector = 'saved-books-page';

@Component({
  selector: savedBooksSelector,
  templateUrl: './saved-books-page.component.html',
})
@Injectable()
export class SavedBooksComponent implements OnInit {
  groups = [];
  profiles = [];
  displayFlag = false;
  savedSubtitle: string;

  constructor ( private tealium: TealiumUtagService ) {}

  ngOnInit() {
    // send tealium page load event
    this.tealium.track( 'view', {
      'page_name': 'Saved Recommendations Page'
    });

    this.loadItemsFromStorage();
  }

  loadItemsFromStorage() {
    this.groups = [];
    const groupsTemp = {};

    const savedData = localStorage.getItem('prhc-saved-books');
    const items = JSON.parse(savedData);

    // grouping isbns by profiles
    if (items) {
      // separating isbns into groups of profiles
      // tslint:disable-next-line:forin
      for (const isbn in items) {
        const humanReadableProfiles = [];
        items[isbn].profileTag.map(profile => {
          profile = convertToHumanType(profile);
          humanReadableProfiles.push(profile);
        });
        items[isbn].humanReadableProfiles = humanReadableProfiles;

        const groupKey = humanReadableProfiles.join(',');
        if (groupsTemp[groupKey]) {
          groupsTemp[groupKey].push(items[isbn]);
        } else {
          groupsTemp[groupKey] = [];
          groupsTemp[groupKey].push(items[isbn]);
        }
      }

      // convert object groups to array for rendering
      // tslint:disable-next-line:forin
      for (const groupKey in groupsTemp) {
        this.groups.push({
          profiles: groupKey.split(','),
          books: groupsTemp[groupKey],
        });
      }

      // sort by number of profiles
      this.groups.sort((a, b) =>
        (a.profiles.length > b.profiles.length) ? 1 : ((b.profiles.length > a.profiles.length) ? -1 : 0)
      );
    }

    this.displayFlag = !(this.groups.length < 1);
    if (this.groups.length) {
      this.savedSubtitle = '';
    } else {
      this.savedSubtitle = 'You haven\'t saved any book yet';
    }
  }

  removeBook(isbn) {
    const savedData = localStorage.getItem('prhc-saved-books');
    // check if there's saved data
    if (savedData) {
      // const parsedData = JSON.parse(savedData);
      const items = JSON.parse(savedData);
      delete items[isbn.isbn];
      localStorage.setItem('prhc-saved-books', JSON.stringify(items));

      // send tealium page load event
      this.tealium.track('link', {
        'event_type': 'remove_book',
        'product_isbn': isbn.isbn,
        'product_title': isbn.title,
      });
    }

    this.loadItemsFromStorage();
  }
}
