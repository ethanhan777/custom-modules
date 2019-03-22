import {
  Component,
  OnInit,
  // Inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';

export const mlclGridBookSelector = 'mlcl-grid-book';

@Component({
  selector: 'mlcl-grid-book',
  templateUrl: './mlcl-grid-book.component.html',
})

export class MlclGridBookComponent implements OnInit {
  @Input() type: string;
  @Input() defaultSort = 0;
  @Output() sortChange = new EventEmitter<any>();
  @Output() loadMore = new EventEmitter<any>();

  @Input() heading: string;
  @Input() data: any;
  @Input() loading = false;
  @Input() sortFlag: boolean;
  @Input() loadMoreFlag: boolean;
  @Input() loadMoreCounter: number;

  private currentContentType = getCurrentContentInfo().type;
  showSignUp = false;

  sortOptions = [
    { name: 'onsale', dir: 'desc', desc: 'Newest to Oldest' },
    { name: 'onsale', dir: 'asc', desc: 'Oldest to Newest' },
    { name: 'title', dir: 'asc', desc: 'Title A - Z' },
    { name: 'title', dir: 'desc', desc: 'Title Z - A' },
    { name: 'authorLast', dir: 'asc', desc: 'Author A - Z' },
    { name: 'authorLast', dir: 'desc', desc: 'Author Z - A' },
  ];
  selectedOption: any;

  seriesSortOptions = [
    { name: 'seriesNumber', dir: 'desc', desc: 'Last to First' },
    { name: 'seriesNumber', dir: 'asc', desc: 'First to Last' },
  ];

  ngOnInit() {
    if (
      this.currentContentType === 'excerpts' ||
      this.currentContentType === 'book-club-resources'
    ) {
      this.showSignUp = true;
    } else if (this.data.length <= 7) {
      this.showSignUp = false;
    }
    // remove onsale sort if it's new release and coming soon
    if (['new-release', 'coming-soon'].indexOf(this.type) > -1) {
      this.sortOptions.splice(0, 2);
    } else if (this.type === 'series') {
      this.sortOptions = this.seriesSortOptions;
    }

    this.sortFlag = this.sortFlag === false ? this.sortFlag : true;

    // set default sort options
    this.selectedOption = this.sortOptions[this.defaultSort];
  }

  /**
   * call api with different sort options
   *
   * @param {option} an object data of ngModelChange for form "select" element
   */
  sort(option) {
    this.sortChange.emit(option);
    this.selectedOption = option;
  }

  /**
   * load more api data
   *
   * @param {rows}
   */
  loadMoreBooks() {
    this.loadMore.emit(true);
  }
}
