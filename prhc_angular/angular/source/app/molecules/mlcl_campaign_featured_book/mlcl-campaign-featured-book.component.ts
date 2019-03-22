import {
  Component,
  Injectable,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

@Component({
  selector: 'mlcl-campaign-featured-book',
  templateUrl: './mlcl-campaign-featured-book.component.html',
})
@Injectable()
export class MlclCampaignFeaturedBookComponent implements OnInit, OnDestroy {
  @Input() featuredBook;
  @Input() isSaveButton = false;
  @Output() savedBook = new EventEmitter<any>();
  customHeading: string;
  customDescription: any;
  staffPick = false;
  title: any;
  buttons = [];
  lightboxOn = false;
  audioClipOn = false;
  audioUrl: string;
  isbn;
  private subscriptions = new Subscriber();

  constructor (
    private enhanced: EnhancedApiService,
    private _sanitizer: DomSanitizer,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    if (this.featuredBook && this.featuredBook.attributes.field_isbn) {
      this.isbn = this.featuredBook.attributes.field_isbn;
      this.customHeading = this.featuredBook.attributes.field_subheading;
      this.staffPick = this.featuredBook.attributes.field_staff_pick;

      if (this.featuredBook.attributes.field_custom_description) {
        const customDesc = this.featuredBook.attributes.field_custom_description.value;
        this.customDescription = this._sanitizer.bypassSecurityTrustHtml(
          customDesc,
        );
      }

      this.subscriptions.add(
        this.enhanced
          .getTitle(this.isbn, 'display')
          .subscribe(response => {
            if (response.data && response.data.length) {
              this.title = response.data[0];

              // excerpt button
              if (this.title.hasExcerpt) {
                this.buttons.push({
                  label: 'Read an Excerpt',
                  seoFriendlyUrl: this.title.seoFriendlyUrl + '/excerpt',
                });
              }

              // audiobook excerpt button
              if (this.title.hasAudioExcerpt === true) {
                for (const key in this.title.excerptRelatedLinks) {
                  if (this.title.excerptRelatedLinks[key].linkAttr === 24000) {
                    this.audioUrl = this.title.excerptRelatedLinks[key].url;
                  }
                }

                this.buttons.push({
                  label: 'Listen to a Clip',
                });
              }

              // onsale date parsing
              if (this.title.onSaleDate && this.title.onSaleDate.date) {
                this.title.onsale = this.title.onSaleDate.date;
              }
            }
          })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  buttonOnClick(buttonLabel?) {
    const currentContentInfo = getCurrentContentInfo();

    const authors = [];
    this.title.contributors.map(contributor => {
      if (contributor.roleCode === 'A') {
        authors.push(contributor.display);
      }
    });

    const categories = [];
    this.title.categories.map(category => {
      categories.push(category.catDesc);
    });

    const utagLink = {
      'event_type': 'buy_button',
      'product_author': authors.join(' | '),
      'product_title' : this.title.title,
      'page_type': currentContentInfo.type ? currentContentInfo.type : 'Home Page',
      'product_isbn': this.title.isbn,
      'product_format': this.title.format.name,
      'product_work_id': this.title.workId,
      'product_imprint': this.title.imprint.name,
      'product_category': categories.join(' | '),
    };

    if (buttonLabel) {
      if (buttonLabel === 'Read an Excerpt') {
        utagLink.event_type = 'read_excerpt';
      } else if (buttonLabel === 'Listen to a Clip') {
        // turn on soundcloud
        this.audioClipOn = true;
        utagLink.event_type = 'audio_plays';
      }
    }

    this.tealium.track('link', utagLink);

  }

  onClick() {
    this.tealium.track('link', {
      'module_type': 'Campaign Feature',
      'module_variation': this.title.title,
    });
  }

  saveOnClick(status) {
    this.savedBook.emit(status);
  }

  lightboxEvent(buy) {
    this.buttonOnClick();
    this.lightboxOn = buy;
    document.getElementsByTagName('body')[0].classList.add('cmpnt_lightbox-open');
  }

  // change the value of lightboxOn when the lightbox is closed
  lightboxOff(clickedValue) {
    this.lightboxOn = clickedValue;
    document.getElementsByTagName('body')[0].classList.remove('cmpnt_lightbox-open');
  }
}
