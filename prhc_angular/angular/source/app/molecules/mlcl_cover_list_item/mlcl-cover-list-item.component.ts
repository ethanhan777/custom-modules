import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { decodeHTML } from '../../services/common.service';

@Component({
  selector: 'mlcl-cover-list-item',
  templateUrl: './mlcl-cover-list-item.component.html',
})
export class MlclCoverListItemComponent implements OnInit {
  @Input() item;
  @Output() clicked = new EventEmitter<any>();
  @Input() smallText: string;

  ngOnInit() {
    // parse books api data for rendering.
    if (this.item.docType === 'work' || this.item.docType === 'isbn') {
      this.item.label = 'Book';
      const authors = [];
      if (this.item.authors) {
        this.item.authors.forEach((author) => {
          if (author.contribRoleCode === 'A' || author.contribRoleCode === 'I') {
            authors.push(author.authorDisplay);
          }
        });
        this.smallText = authors.join(', ');
      }

      if (this.item.formats) {
        this.item.formatsLabel = this.item.docType === 'work' ? 'Available in: ' : 'Format: ';
        this.item.formats.forEach((format) => {
          format.name = format.format;
          format.seoFriendlyUrl = this.item.seoFriendlyUrl;
          // only add format name if docType is work
          if (this.item.docType === 'work') {
            format.seoFriendlyUrl += '/' + format.format.toLowerCase().split(' ').join('');
          }
        });
      }
    }

    // parse authors api data for rendering.
    if (this.item.docType === 'author') {
      this.item.label = 'Author';
    }

    // parse events api data for rendering.
    if (this.item.docType === 'event') {
      this.item.label = 'Event';
      if (this.item.author && this.item.author.length) {
        this.item.title = this.item.author[0].display + ' at ';
      }
      this.item.title += this.item.location;
    }

    // parse series api data for rendering.
    if (this.item.docType === 'series') {
      this.item.label = 'Series';
      const authors = [];
      this.item.seriesAuthor.forEach((author, index) => {
        if (index < 3) {
          authors.push(author.authorDisplay);
        }
      });
      this.smallText = authors.join(', ');

      this.item.code = this.item.key;
    }

    // changes for recipes
    if (!this.item.docType) {
      this.item.subtitle = undefined;
    }

    // decode html character in category tag
    if (this.item.articleCategories && this.item.articleCategories.length) {
      this.item.articleCategories.map(cat => {
        cat.name = decodeHTML(cat.name);
      });
    }
  }

  isClicked(clickedValue) {
    this.clicked.emit(clickedValue);
  }
}
