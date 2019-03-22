import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { RetailersService } from '../../services/retailers.service';
import { getFormattedDate } from '../../services/date_format.service';
import { checkPrice } from '../../services/common.service';
import { parseUtagLink, TealiumUtagService } from '../../services/utag.service';

export const mlclBuyWorkflowSelector = 'mlcl-buy-workflow';

@Component({
  selector: mlclBuyWorkflowSelector,
  templateUrl: './mlcl-buy-workflow.component.html',
})
@Injectable()
export class MlclBuyWorkflowComponent implements OnInit, OnChanges, OnDestroy {
  @Input() currentWork: any;
  @Input() isbn;
  @Input() buyClicked;
  // @Input() segmentScores;
  @Output() closed = new EventEmitter<any>();

  formatIsbn: string;
  isLoaded = false;
  title: any;
  independent = false;
  lightboxOn: boolean;

  private formats = [];
  private subscriptions = new Subscriber();

  constructor (
    private enhanced: EnhancedApiService,
    private retailers: RetailersService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    this.lightboxOn = true;
    if (this.currentWork) {
      this.displayTitle(this.currentWork);
    } else {
      this.subscriptions.add(
        this.enhanced
          .getTitle(this.isbn, 'display')
          .subscribe(response => {
            if (response.data && response.data.length) {
              response['data'].map(work => {
                this.currentWork = work;
                this.displayTitle(this.currentWork);
              });
            }
          })
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isbn && changes.isbn.previousValue) {
      const isbn: SimpleChange = changes.isbn;
      this.isbn = isbn.currentValue;
      this.displayTitle(this.currentWork);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  displayTitle(work) {
    if (work.otherFormats) {
      this.formats = [];
      work.otherFormats.map(title => {
        // display title info
        // change the current title isbn to a string
        const currentIsbn = title.isbn.toString();

        // only list the other formats
        const format = {
          name: title.format.name,
          seoFriendlyUrl: undefined,
          isbn: title.isbn,
          active: false,
        };

        if (currentIsbn === this.isbn.toString()) {
          format.active = true;
        }
        this.formats.push(format);

        // set content for current title
        if (currentIsbn === this.isbn.toString()) {
          this.title = title;
          this.title.author = work.author;
          this.title.docType = 'buy-workflow';
          this.title.formatsLabel = 'Change Format:';
          this.title.label = title.format.name;
          this.title.formats = this.formats;
          this.title.cover = 'https://images.randomhouse.com/cover/' + this.isbn;
          this.title.parsedOnSale = getFormattedDate(title.onSaleDate.date);
          // set price
          this.title.subtitle = checkPrice(title.canPrice);
          // set isLoaded flag and display retailer options
          this.isLoaded = true;
          this.retailers.setRetailers(this.title);
        }
      });
    }
  }

  // get the format isbn to reset displayTitle
  changeFormat(clicked) {
    // event.preventDefault();
    // start with an empty format list
    this.formats = [];
    this.isbn = clicked.toString();
    this.displayTitle(this.currentWork);
  }

  // display content to search for indies
  shopIndependent(retailerName) {
    if (retailerName === 'Shop Independent') {
      this.independent = true;
    }

    const currentContentInfo = getCurrentContentInfo();
    // const utagLink = parseUtagLink('affiliate_click', currentContentInfo.type, this.title, this.segmentScores);
    const utagLink = parseUtagLink('affiliate_click', currentContentInfo.type, this.title);
    utagLink['affiliate_name'] = retailerName;
    this.tealium.track('link', utagLink);
  }

  // close the buy workflow
  lightboxOff() {
    this.independent = false;
    this.lightboxOn = false;
    this.closed.emit(this.lightboxOn);
    document.getElementsByTagName('body')[0].classList.remove('cmpnt_lightbox-open');
  }

  keepLightboxOn(event) {
    event.stopPropagation();
  }
}
