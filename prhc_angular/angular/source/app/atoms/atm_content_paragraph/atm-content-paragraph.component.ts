import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
// import { EnhancedApiBase } from '../../shared/enhanced_base.component';
import { truncateString } from '../../services/common.service';

@Component({
  selector: 'atm-content-paragraph',
  templateUrl: './atm-content-paragraph.component.html',
})
export class AtmContentParagraphComponent implements OnInit, OnChanges {
  @Input() paragraph: string;
  @Input() trunc = 0;
  @Input() keepReadingFlag: boolean;
  @Input() accordionId;
  @Output() clicked = new EventEmitter<any>();
  lightboxOn: boolean;

  ngOnInit() {
    // truncate paragraph if trunc is set
    if (this.paragraph && this.trunc > 0) {
      this.paragraph = truncateString(this.paragraph, this.trunc);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.paragraph && changes.paragraph.previousValue) {
      const paragraph: SimpleChange = changes.paragraph;
      this.paragraph = paragraph.currentValue;
      if (this.paragraph && this.trunc > 0) {
        this.paragraph = truncateString(this.paragraph, this.trunc);
      }
    }
  }

  fullDescOpen() {
    this.lightboxOn = true;
    this.clicked.emit(this.lightboxOn);
  }
}
