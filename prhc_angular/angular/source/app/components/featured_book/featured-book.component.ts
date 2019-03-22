import {
  Component,
  OnInit,
  Input,
  Injectable,
  OnDestroy
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo,
  parseFeaturedBook
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

export const featuredBookSelector = 'featured-book';

@Component({
  selector: featuredBookSelector,
  templateUrl: './featured-book.component.html',
})
@Injectable()
export class FeaturedBookComponent implements OnInit, OnDestroy {
  @Input() isbn: string;
  @Input() OpenbuyWorkflow;
  @Input() sealFlag = false;
  title: any;
  // hasExcerptFlag = false;
  // links: any[] = [];
  label: string;
  // dateLabel: string;
  // onsaleDateFlag = false;
  lightboxOn: boolean;
  private subscriptions = new Subscriber();

  constructor (
    private enhanced: EnhancedApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    // get current title if on excerpt, reading guide, recipe view
    const currentContentInfo = getCurrentContentInfo();
    if (currentContentInfo.bookContent || this.isbn) {
      this.isbn = this.isbn ? this.isbn : currentContentInfo.isbn;
      this.subscriptions.add(
        this.enhanced
          .getTitle(this.isbn, 'display')
          .subscribe(response => {
            if (response['data'] && response['data'].length) {
              response['data'].map(content => {
                this.title = content;
                this.title.photo = this.title.cover;
                this.title.onsale = this.title.onSaleDate.date;
                this.title.buttons = [
                { label: 'Read More',
                  seoFriendlyUrl: content.seoFriendlyUrl,
                }];
              });
            }
          })
      );
    } else {
      this.subscriptions.add(
        this.enhanced
          .getFeaturedBook()
          .map(parseFeaturedBook)
          .subscribe(response => {
            if (response.newRelease['data']) {
              this.title = response.newRelease['data'][0];
              this.title.label = 'New Release';
            } else if (response.comingSoon['data']) {
              this.title = response.comingSoon['data'][0];
              this.title.label = 'Coming Soon';
            }
            if (this.title) {
              this.isbn = this.title.isbn.toString();
            }
          })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  buttonOnClick(buttonLabel?) {
    if (buttonLabel && buttonLabel === 'Read More') {
      return false;
    }

    const currentContentInfo = getCurrentContentInfo();
    const authors = [];
    if (this.title.contributors) {
      this.title.contributors.map(contributor => {
        if (contributor.contribRoleCode === 'A') {
          authors.push(contributor.display);
        }
        if (contributor.roleCode === 'A') {
          authors.push(contributor.display);
        }
      });
    }

    const categories = [];
    if (this.title.categories) {
      this.title.categories.map(category => {
        categories.push(category.description ? category.description : category.catDesc);
      });
    }

    const utagLink = {
      'event_type': 'buy_button',
      'product_author': authors.join(' | '),
      'product_title' : this.title.title,
      'page_type': currentContentInfo.type,
      'product_isbn': this.title.isbn,
      'product_format': this.title.format.description ? this.title.format.description : this.title.format.name,
      'product_work_id': this.title.workId,
      'product_imprint': this.title.imprint.description ? this.title.imprint.description : this.title.imprint.name,
      'product_category': categories.join(' | '),
    };

    if (buttonLabel && buttonLabel === 'Excerpt') {
      utagLink.event_type = 'read_excerpt';
    }

    this.tealium.track('link', utagLink);
  }

  lightboxEvent(clicked) {
    this.buttonOnClick();
    this.lightboxOn = clicked;
    document.getElementsByTagName('body')[0].classList.add('cmpnt_lightbox-open');
  }

  lightboxOff(clickedValue) {
    this.lightboxOn = clickedValue;
    document.getElementsByTagName('body')[0].classList.remove('cmpnt_lightbox-open');
  }

}
