import {
  Component,
  OnInit,
  Injectable,
  OnDestroy
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo,
  setCategories } from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

export const bookContentSelector = 'book-content';

@Component({
  selector: bookContentSelector,
  templateUrl: './book-content.component.html',
})
@Injectable()
export class BookContentComponent implements OnInit, OnDestroy {
  title: any;
  categories = [];
  label: string;
  isLoaded = false;
  currentContentInfo = getCurrentContentInfo();
  private subscriptions = new Subscriber();

  constructor (
    private enhanced: EnhancedApiService,
    private tealium: TealiumUtagService
  ) {}

  ngOnInit() {
    // get current title if on excerpt, reading guide, recipe view
    this.enhanced
      .getTitle(this.currentContentInfo.isbn, 'display')
      .subscribe(response => {
        if (response['data'] && response['data'].length) {
          response['data'].map(content => {
            if (this.currentContentInfo.bookContent === 'excerpt') {
              this.title = {
                excerpt: content.textExcerpt,
                textExcerptCopyright: content.textExcerptCopyright,
                publishers: [{
                  name: content.imprint.name,
                  seoFriendlyUrl: `/imprints/${ content.imprint.code }/${ content.imprint.name }`,
                }],
              };
            } else if (this.currentContentInfo.bookContent === 'reading-guide') {
              this.title = {
                publishers: [{
                  name: content.imprint.name,
                  seoFriendlyUrl: `/imprints/${ content.imprint.code }/${ content.imprint.name }`,
                }],
                readingGuides: [
                  content.readingGuide.about,
                  content.readingGuide.authbio,
                  content.readingGuide.discussion,
                  content.readingGuide.copy,
                  content.readingGuide.suggest
                ],
              };
            }
            // get the categories
            if (content.categories) {
              this.categories = setCategories(content.categories);
            }
          });
          this.isLoaded = true;
        }
      });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  printPage() {
    this.tealium.track('link', {
      'event_type': 'print_button',
      'page_type': 'reading-guide',
    });

    window.print();
  }
}
