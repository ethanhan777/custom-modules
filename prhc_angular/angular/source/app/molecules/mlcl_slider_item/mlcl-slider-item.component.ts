import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'mlcl-slider-item',
  templateUrl: './mlcl-slider-item.component.html',
})
export class MlclSliderItemComponent implements OnInit {
  @Input() content: any;
  @Input() type: string;
  @Input() saveButtonFlag = false;
  outputData: any;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() clicked = new EventEmitter<any>();
  @Output() savedBook = new EventEmitter<any>();
  coverHeight = '225';

  ngOnInit() {
    if (this.content) {
      this.outputData = this.content.title;
      // cover image validator
      if (!this.content.cover && this.content._links) {
        this.content._links.forEach(link => {
          if (link.rel === 'icon') {
            this.content.cover = link.href;
          }
        });
      }

      if (this.type === 'book') {
        this.content.subtitle = this.content.author;
      }

      if (!this.content.title) {
        this.content.title = this.content.name;
      }

      if (this.type === 'format') {
        this.outputData = this.content.seoFriendlyUrl;
        this.coverHeight = '162';
      }

      if (!this.content.isbn) {
        this.saveButtonFlag = false;
      }
    }
  }

  onClick(e, title) {
    if (this.type === 'format') {
      e.preventDefault();
    }
    this.clicked.emit(title);
  }

  saveOnClick(status) {
    this.savedBook.emit(status);
  }
}
