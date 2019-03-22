import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';

import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';
import { PrhcApiService } from '../../services/prhc_api.service';
import {
  TealiumUtagService,
  parseUtagLinkTitle
} from '../../services/utag.service';

export const bookExcerptPageSelector = 'book-excerpt-page';

@Component({
  selector: bookExcerptPageSelector,
  templateUrl: './book-excerpt-page.component.html',
})
@Injectable()
export class BookExceprtPageComponent implements OnInit, OnDestroy {
  book: any;
  pageClass: string;
  bookClubFlag = false;
  private subscriptions = new Subscriber();

  constructor(
    private enhanced: EnhancedApiService,
    private prhc: PrhcApiService,
    private tealium: TealiumUtagService
  ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();
    this.pageClass = currentContentInfo.bookContent;
    this.getTitleByIsbn(currentContentInfo.isbn, currentContentInfo.bookContent);

    this.subscriptions.add(
    this.prhc
      .getBookClubByISBN(currentContentInfo.isbn)
      .subscribe(response => {
        if (response['data'] && response['data'].length) {
          this.bookClubFlag = true;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getTitleByIsbn(isbn, bookContent) {
    this.subscriptions.add(
      this.enhanced
        .getTitle(isbn, 'display')
        .subscribe(response => {
          if (response.data && response.data.length) {
            this.book = response.data[0];
            this.sendTealiumData(this.book, bookContent);
          }
        })
    );
  }

  sendTealiumData(title, bookContent) {
    const parsedUtagData = parseUtagLinkTitle(title);
    delete parsedUtagData.event_type;
    if (bookContent === 'excerpt') {
      parsedUtagData.page_type = 'excerpt';
      parsedUtagData['page_name'] = 'Excerpt From ' + title.title;
    } else {
      parsedUtagData.page_type = 'reading-guide';
      parsedUtagData['page_name'] = 'Reading Guide From ' + title.title;
    }
    this.tealium.track('view', parsedUtagData);
  }
}
