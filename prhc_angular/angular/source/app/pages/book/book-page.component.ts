import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import {
  parseUtagLinkTitle,
  TealiumUtagService
} from '../../services/utag.service';

export const bookSelector = 'book-page';

@Component({
  selector: bookSelector,
  templateUrl: './book-page.component.html',
})
@Injectable()
export class BookComponent implements OnInit, OnDestroy {
  book: any;
  private subscriptions = new Subscriber();

  constructor(
    private enhanced: EnhancedApiService,
    private tealium: TealiumUtagService
  ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();
    this.getWorkByWorkId(currentContentInfo.id);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getWorkByWorkId(workId) {
    this.subscriptions.add(
      this.enhanced
        .getWork(workId, 'display')
        .subscribe(title => {
          if (title.data && title.data.length) {
            this.book = title.data[0];
            this.sendTealiumData(this.book);
          }
        })
    );
  }

  changeFormat(url) {
    const path = url.split('/');
    const isbn = path[path.length - 1];
    if (isbn.length === 13) {
      const workData = {
        praises: this.book.praises,
        videoRelatedLinks: this.book.videoRelatedLinks,
        relatedLinks: this.book.relatedLinks,
        bookAwards: this.book.bookAwards,
        readingGuide: this.book.readingGuide,
        frontlistiestTitle: this.book.frontlistiestTitle,
        otherFormats: this.book.otherFormats,
      };

      this.book.otherFormats.map(title => {
        if (title.isbn.toString() === isbn) {
          // update book metadata
          this.book = Object.assign(title, workData);

          // add praise
          this.book.praise = this.book.praises[isbn];

          title._links.map(link => {
            if (link.rel === 'icon') {
              this.book.cover = link.href;
            }
          });
        }
      });

      window.history.pushState('', '', url);
      this.sendTealiumData(this.book);
    }
  }

  sendTealiumData(title) {
    const parsedUtagData = parseUtagLinkTitle(title);
    delete parsedUtagData.event_type;
    parsedUtagData.page_type = 'books';
    parsedUtagData['page_name'] = title.title;
    this.tealium.track('view', parsedUtagData);
  }
}
