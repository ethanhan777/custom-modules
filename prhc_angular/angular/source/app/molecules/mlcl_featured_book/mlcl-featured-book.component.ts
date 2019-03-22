import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Injectable
} from '@angular/core';

import { parseUtagLinkTitle, TealiumUtagService } from '../../services/utag.service';
import { truncateString } from '../../services/common.service';

@Component({
  selector: 'mlcl-featured-book',
  templateUrl: './mlcl-featured-book.component.html',
})
@Injectable()
export class MlclFeaturedBookComponent implements OnInit {
  @Input() title;
  @Input() index: number;
  @Input() segmentScores;
  @Input() customHeading: string;
  @Input() customDescription: string;
  @Input() skipTruncateString: boolean;
  @Input() staffPick = false;
  @Input() fromExcerpt = false;
  @Input() profile: string;
  @Input() isSaveButton = false;
  @Input() sealFlag = false;
  @Output() savedBook = new EventEmitter<any>();

  buttons = [];
  lightboxOn = false;
  audioClipOn = false;
  audioUrl: string;

  constructor ( private tealium: TealiumUtagService ) {}

  ngOnInit() {

    // excerpt button
    if (!this.fromExcerpt && this.title.hasExcerpt) {
      this.buttons.push({
        label: 'Read an Excerpt',
        seoFriendlyUrl: this.title.seoFriendlyUrl + '/excerpt',
      });
    }

    // onsale date parsing
    if (this.title.onSaleDate && this.title.onSaleDate.date) {
      this.title.onsale = this.title.onSaleDate.date;
    }

    // audiobook excerpt button
    if (!this.fromExcerpt && this.title.hasAudioExcerpt) {
      for (const key in this.title.excerptRelatedLinks) {
        if (this.title.excerptRelatedLinks[key].linkAttr === 24000) {
          this.audioUrl = this.title.excerptRelatedLinks[key].url;
        }
      }

      this.buttons.push({
        label: 'Listen to a Clip',
      });
    }

    // read more button
    if (this.fromExcerpt) {
      this.buttons.push({
        label: 'Read More',
        seoFriendlyUrl: this.title.seoFriendlyUrl,
      });
    }

    if (this.customDescription && !this.skipTruncateString) {
      this.customDescription = truncateString(this.customDescription, 280);
    }
  }

  buttonOnClick(buttonLabel?) {
    const utagLink = parseUtagLinkTitle(this.title);

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
