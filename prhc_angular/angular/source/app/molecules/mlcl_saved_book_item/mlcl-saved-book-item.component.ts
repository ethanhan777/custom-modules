import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  truncateString,
  removeBoldTags
} from '../../services/common.service';

@Component({
  selector: 'mlcl-saved-book-item',
  templateUrl: './mlcl-saved-book-item.component.html',
})
export class MlclSavedBookItemComponent implements OnInit {
  @Input() title;
  @Output() removeIsbn = new EventEmitter<any>();
  lightboxOn = false;
  buttons = [];

  ngOnInit() {
    if (this.title && this.title._embeds) {
      this.title._embeds.map(embed => {
        if (embed.content) {
          this.title.hasExcerpt = embed.content.excerpt ? true : false;
          this.title.aboutTheBook =
            embed.content.positioning ?
            removeBoldTags(embed.content.positioning) :
            truncateString(embed.content.flapcopy, 280);
        }
      });
    } else if (this.title.aboutTheBook) {
      this.title.aboutTheBook = truncateString(this.title.aboutTheBook, 280);
    }

    // excerpt button
    if (this.title.hasExcerpt) {
      this.buttons.push({
        label: 'Read an Excerpt',
        seoFriendlyUrl: this.title.seoFriendlyUrl + '/excerpt',
      });
    }
  }

  removeBook(isbn, title) {
    // remove isbn from local storage
    this.removeIsbn.emit({isbn, title});
  }

  lightboxEvent(buy) {
    this.lightboxOn = buy;
    document.getElementsByTagName('body')[0].classList.add('cmpnt_lightbox-open');
  }

  // change the value of lightboxOn when the lightbox is closed
  lightboxOff(clickedValue) {
    this.lightboxOn = clickedValue;
    document.getElementsByTagName('body')[0].classList.remove('cmpnt_lightbox-open');
  }
}
