import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  Injectable
} from '@angular/core';
import { scrollToClass } from '../../services/scroll.service';
import { TealiumUtagService } from '../../services/utag.service';

@Component({
  selector: 'mlcl-hero-desc',
  templateUrl: './mlcl-hero-desc.component.html',
})
@Injectable()
export class MlclHeroDescComponent implements OnInit, OnChanges {
  @Input() content;
  @Input() desc: string;
  @Input() onSaleDate: any;

  @Input() type;
  @Input() accordionId;
  @Input() relatedLinks;

  @Input() keepReadingFlag: boolean;
  @Output() clickedBuy = new EventEmitter<any>();
  @Output() clickedListen = new EventEmitter<any>();

  lightboxOn: boolean;
  fullDescription: string;
  shortDesc: string;
  links = [];

  constructor ( private tealium: TealiumUtagService ) {}

  ngOnInit() {
    this.descDataPreprocess();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.content && changes.content.previousValue) {
      const content: SimpleChange = changes.content;
      this.content = content.currentValue;
      this.desc = content.currentValue.desc;
      this.onSaleDate = content.currentValue.onSaleDate;

      this.descDataPreprocess();
    }
  }

  descDataPreprocess() {
    this.links = [];
    if (this.relatedLinks && this.relatedLinks.length > 0) {
      this.relatedLinks.forEach(relatedLink => {
        this.links.push({
          label: relatedLink.linkText,
          seoFriendlyUrl: relatedLink.url,
        });
      });
    }

    // if it is over 700 characters, add keep reading link
    if (this.desc) {
      if (this.desc.length <= 700) {
        this.keepReadingFlag = false;
      } else {
        this.keepReadingFlag = true;
      }
    } else {
      this.keepReadingFlag = false;
    }

    // excerpt
    if (this.content.excerptUrl) {
      this.links.push(setExRgButton('excerpt', this.content.excerptUrl));
    }
    // reading guide
    if (this.content.readingGuideUrl) {
      this.links.push(setExRgButton('reading-guide', this.content.readingGuideUrl));
    }
    // audio excerpt for #636
    // if (this.hasAudioExcerpt) {
    //   this.links.push(setExRgButton('audio-excerpt'));
    // }
  }

  buttonOnClick(buttonLabel) {
    const authors = [];
    if (this.content.contributors) {
      this.content.contributors.map(contributor => {
        if (contributor.roleCode === 'A') {
          authors.push(contributor.display);
        }
      });
    }
    const categories = [];
    if (this.content.categories) {
      this.content.categories.map(category => {
        categories.push(category.catDesc);
      });
    }

    const utagLink = {
      'event_type': '',
      'product_author': authors.join(' | '),
      'product_title' : this.content.title,
      'page_type': this.type,
      'product_isbn': this.content.isbn,
      // 'product_format': this.content.format.name,
      'product_category': categories.join(' | '),
      'product_work_id': this.content.workId,
      // 'product_imprint': this.content.imprint.name,
    };
    if (this.content.imprint) {
      utagLink['product_imprint'] = this.content.imprint.name;
    }
    if (this.content.format) {
      utagLink['product_format'] = this.content.format.name;
    }

    if (buttonLabel === 'Look Inside') {
      utagLink.event_type = 'insight_widget_view';
      this.tealium.track('link', utagLink);
    } else if (buttonLabel === 'Read an Excerpt') {
      utagLink.event_type = 'read_excerpt';
      this.tealium.track('link', utagLink);
    } else if (buttonLabel === 'Reading Guide') {
      utagLink.event_type = 'reading_guide';
      this.tealium.track('link', utagLink);
    } else if (buttonLabel === 'buy_button') {
      utagLink.event_type = 'buy_button';
      this.tealium.track('link', utagLink);
    } else if (buttonLabel === 'audio_plays') {
      utagLink.event_type = 'audio_plays';
      this.tealium.track('link', utagLink);
    }
  }

  buyButtonClick(buyWorkflow) {
    this.buttonOnClick('buy_button');
    this.clickedBuy.emit(buyWorkflow);
  }

  audioButtonClick() {
    this.buttonOnClick('audio_plays');
    this.clickedListen.emit(this.content.audioExcerptUrl);
  }

  keepReading(event) {
    const firstHalf = this.desc.substring(0, 700);
    const keepReadingTag =
      `<span class="atm_keep-reading-flag" id="keep-reading-icon" aria-hidden="true">` +
      `<small><i class="fa fa-arrow-down"></i></small>` +
      `</span>`;
    const secondHalf = this.desc.substr(700);
    this.fullDescription = `<p>${firstHalf}${keepReadingTag}${secondHalf}`;

    this.lightboxOn = event;
    document
      .getElementsByTagName('body')[0]
      .classList.add('cmpnt_lightbox-open');

      setTimeout(function() {
        scrollToClass('atm_keep-reading-flag');
      }, 500);
  }

    /**
   * Turn off the lightbox
   */
  lightboxOff() {
    this.lightboxOn = false;
    document
      .getElementsByTagName('body')[0]
      .classList.remove('cmpnt_lightbox-open');
  }

  keepLightboxOn(event) {
    event.stopPropagation();
  }
}

export function setExRgButton(type, url) {
  let label = 'Read an Excerpt';

  if (type === 'reading-guide') {
    label =  'Reading Guide';
  }
  // for #636
  // else if (type === 'audio-excerpt') {
  //   label =  'Listen to a clip';
  // }

  return {
    label: label,
    seoFriendlyUrl: url,
    windowFlag: false,
  };
}
