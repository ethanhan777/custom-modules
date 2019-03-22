import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';

@Component({
  selector: 'mlcl-nl-programs',
  templateUrl: './mlcl-nl-programs.component.html',
})
// @Injectable()
export class MlclNlProgramsComponent implements OnInit {
  @Input() mcguid: string;
  @Input() prefStatus: any;
  @Input() prefs: any;
  @Output() userPrefs = new EventEmitter<any>();

  // categorizing the preferences
  prefLists = [{
      title: 'Exclusive News',
      id: 'exclusive-news',
      toggle: true,
      chevron: 'chevron-up',
      prefs: [
        21027, // Audiobooks
        21050, // Behind the Scenes
        21003, // Book Club
        21049, // PRH Canada Events
        21048, // New Releases
      ],
      categorizedPrefs: [],
    },
    {
      title: 'Authors',
      id: 'authors',
      toggle: true,
      chevron: 'chevron-up',
      prefs: [
        21051, // Author Alerts
      ],
      categorizedPrefs: [],
    },
    {
      title: 'Children\'s Books',
      id: 'childrens-books',
      chevron: 'chevron-down',
      prefs: [
        21024, // Children's Books
        21022, // Middle Grade (9-12)
        21020, // Picture Books (0-6)
      ],
      categorizedPrefs: [],
    },
    {
      title: 'Classics',
      id: 'classics',
      chevron: 'chevron-down',
      prefs: [
        21028, // Classics
      ],
      categorizedPrefs: [],
    },
    {
      title: 'Cooking',
      id: 'cooking',
      chevron: 'chevron-down',
      prefs: [
        21016, // Cooking
      ],
      categorizedPrefs: [],
    },
    {
      title: 'Fiction',
      id: 'fiction',
      chevron: 'chevron-down',
      prefs: [
        21005, // Fiction
        21007, // Fantasy
        21032, // Gothic & Horror
        21008, // Historical Fiction
        21030, // Literary Fiction
        21006, // Mystery & Suspense
        21033, // Paranormal Fiction
        21025, // Romance
        21031, // Science Fiction
        21034, // Women's Fiction
      ],
      categorizedPrefs: [],
    },
    {
      title: 'Graphic Novels & Manga',
      id: 'graphic-novels-manga',
      chevron: 'chevron-down',
      prefs: [
        21029, // Graphic Novels & Manga
      ],
      categorizedPrefs: [],
    },
    {
      title: 'Non-Fiction',
      id: 'non-fiction',
      chevron: 'chevron-down',
      prefs: [
        21036, // Nonfiction
        21037, // Arts & Entertainment
        21010, // Biography & Memoir
        21011, // Business
        21038, // Crafts, Home & Garden
        21039, // Health & Fitness
        21040, // History
        21023, // Parenting
        21041, // Politics
        21042, // Psychology
        21043, // Religion & Philosophy
        21044, // Science & Technology
        21045, // Self-Improvement
        21014, // Sports
        21046, // Travel
      ],
      categorizedPrefs: [],
    },
    {
      title: 'Merchandise',
      id: 'merchandise',
      chevron: 'chevron-down',
      prefs: [
        21035, // Merchandise
      ],
      categorizedPrefs: [],
    },
    {
      title: 'Poetry',
      id: 'poetry',
      chevron: 'chevron-down',
      prefs: [
        21047, // Poetry
      ],
      categorizedPrefs: [],
    },
    {
      title: 'Teen & Young Adult',
      id: 'teen-young-adult',
      chevron: 'chevron-down',
      prefs: [
        21009, // Teen & Young Adult
      ],
      categorizedPrefs: [],
    },
  ];

  ngOnInit() {
    this.prefs = changePrefName(this.prefs);
    this.prefLists = listGroups(this.prefLists, this.prefs);
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

  onPrefChange($event, prefId, subPrefId?) {
    if (prefId !== 21051) {
      this.prefStatus[prefId] = $event;
    }
    let preferencesQuery;

    if (subPrefId) {
      this.prefStatus[prefId][subPrefId] = $event;
    }

    if (this.mcguid && this.mcguid.length) {
      preferencesQuery = this.prefStatus;
    } else {
      preferencesQuery = preparePreferencesQueryForSubscribe(this.prefs, this.prefStatus);
    }

    this.userPrefs.emit(preferencesQuery);
  }
}

export function preparePreferencesQueryForSubscribe(prefs, prefStatus) {
  const prefParamsArray = [];

  prefs.map(pref => {
    if (prefStatus[pref.id]) {
      prefParamsArray.push(pref.id);
    }
  });
  return prefParamsArray;
}

export function listGroups(prefLists, prefs) {
  // looping through the custom lists and preferences to assign them to the right accordion
  prefLists.map(list => {
    list.prefs.map(eachPref => {
      prefs.map(pref => {
        if (eachPref === pref.id) {
          if (eachPref !== 21051) {
            list.categorizedPrefs.push(pref);
          } else {
            if (
              pref.SubscriberPrefValues &&
              (pref.SubscriberPrefValues.length > 1 ||
              pref.SubscriberPrefValues[0].PreferenceKey !== 0)
            ) {
              list.categorizedPrefs.push(pref);
            }
          }
        }
      });
    });
    // checking for any selected preferences on each list and opening accordion
    const selectedPrefs = [];
    list.categorizedPrefs.map(listPref => {
      if (listPref.SubscriberPrefValues) {
        selectedPrefs.push(listPref);
      }
    });
    if (selectedPrefs.length) {
        list.toggle = true;
        list.chevron = 'chevron-up';
      }
  });

  return prefLists;
}

export function changePrefName(preferences) {
  // change the names of preferences so they make sense in accordions
  preferences.map(pref => {
    // Audiobooks to Audio
    if (pref.id === 21027) {
      pref.name = 'Audio';
    }
    // PRH Canada Events to Events
    if (pref.id === 21049) {
      pref.name = 'Events';
    }
    // Children's Books to All Children's Books
    if (pref.id === 21024) {
      pref.name = 'All Children\'s Books';
    }
    // Middle Grade (9-12) to Children's Middle Grade
    if (pref.id === 21022) {
      pref.name = 'Children\'s Middle Grade';
    }
    // Picture Books (0-6) to Children's Picture Books
    if (pref.id === 21020) {
      pref.name = 'Children\'s Picture Books';
    }
    // Classics to All Classics
    if (pref.id === 21028) {
      pref.name = 'All Classics';
    }
    // Cooking to All Cooking
    if (pref.id === 21016) {
      pref.name = 'All Cooking';
    }
    // Fiction to All Fiction
    if (pref.id === 21005) {
      pref.name = 'All Fiction';
    }
    // Graphic Novels & Manga to All Graphic Novels & Manga
    if (pref.id === 21029) {
      pref.name = 'All Graphic Novels & Manga';
    }
    // Nonfiction to All Non-Fiction
    if (pref.id === 21036) {
      pref.name = 'All Non-Fiction';
    }
    // Merchandise to All Merchandise
    if (pref.id === 21035) {
      pref.name = 'All Merchandise';
    }
    // Poetry to All Poetry
    if (pref.id === 21047) {
      pref.name = 'All Poetry';
    }
    // Teen & Young Adult to All Teen & Young Adult
    if (pref.id === 21009) {
      pref.name = 'All Teen & Young Adult';
    }
  });

  return preferences;
}
