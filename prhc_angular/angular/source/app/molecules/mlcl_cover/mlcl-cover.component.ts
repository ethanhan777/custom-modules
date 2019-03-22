import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  Injectable
} from '@angular/core';
import { TealiumUtagService } from '../../services/utag.service';

@Component({
  selector: 'mlcl-cover',
  templateUrl: './mlcl-cover.component.html',
})
@Injectable()
export class MlclCoverComponent implements OnInit, OnChanges {
  @Input() coverImage: string;
  @Input() coverLink: string;
  @Input() title: string;
  @Input() photoCredit: string;
  @Input() caption: string;
  @Input() isbn: string;
  @Input() author: string;
  @Input() hasInsight: boolean;
  @Input() content: any;
  @Input() work;
  lightbox = false;
  photoCreditFlag = false;
  goodreadsUrl: string;
  lookInside;

  constructor ( private tealium: TealiumUtagService ) {}

  ngOnInit() {
    if (this.photoCredit) {
      this.photoCreditFlag = true;
    }

    if (!this.coverLink && this.work) {
      const urlFriendlyTitle = this.title.replace(/ /g, '-');
      this.coverLink = `/books/${this.work}/${urlFriendlyTitle}/${this.isbn}`;
    }
    this.parseCoverLinks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.content && changes.content.previousValue) {
      this.lookInside = undefined;
      const content: SimpleChange = changes.content;
      this.content = content.currentValue;
      this.isbn = this.content.isbn;
      this.hasInsight = this.content.hasInsight;
      this.parseCoverLinks();
    }
  }

  parseCoverLinks() {
    if (this.isbn) {
      this.goodreadsUrl = 'https://goodreads.com/book/isbn/' + this.isbn;
    }

    if (this.hasInsight && this.isbn) {
      this.lookInside = setLookInsidebutton(this.isbn, this.title, this.author);
    }
  }

  sendTealium(eventType) {
    if (this.content) {
      const authors = [];
      this.content.contributors.map(contributor => {
        if (contributor.roleCode === 'A') {
          authors.push(contributor.display);
        }
      });

      const categories = [];
      this.content.categories.map(category => {
        categories.push(category.catDesc);
      });

      const utagLink = {
        'event_type': eventType,
        'product_author': authors.join(' | '),
        'product_title' : this.content.title,
        'page_type': 'books',
        'product_isbn': this.content.isbn,
        'product_format': this.content.format.name,
        'product_category': categories.join(' | '),
        'product_work_id': this.content.workId,
        'product_imprint': this.content.imprint.name,
      };
      this.tealium.track('link', utagLink);
    }
  }

  openLookInside(event) {
    this.sendTealium('insight_widget_view');

    event.preventDefault();
    window.open(this.lookInside.seoFriendlyUrl, '_blank', 'width=600, height=860');
  }
}

export function setLookInsidebutton(isbn, title, author) {
  // const link = new Link();
  const url = 'https://insight.randomhouse.com/widget/v4/' +
  '?isbn=' + isbn +
  '&title=' + title +
  '&author=' + author +
  '&width=600&refererURL=penguinrandomhouse.ca';

  return {
    label: 'Look Inside',
    seoFriendlyUrl: url,
    windowFlag: true,
  };
}
