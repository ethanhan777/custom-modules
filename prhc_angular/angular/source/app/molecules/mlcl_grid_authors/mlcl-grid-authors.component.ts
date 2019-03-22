import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  // OnChanges,
  // SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'mlcl-grid-authors',
  templateUrl: './mlcl-grid-authors.component.html',
})
export class MlclGridAuthorsComponent implements OnInit {
  // @Input() reload: string;
  @Input() heading: string;
  @Input() data: any;
  @Input() loading = false;
  @Input() sortFlag = true;
  @Input() loadMoreFlag: boolean;
  @Output() sortChange = new EventEmitter<any>();
  @Output() loadMore = new EventEmitter<any>();

  sortOptions = [
    { name: 'authorLast', dir: 'asc', desc: 'Author A - Z' },
    { name: 'authorLast', dir: 'desc', desc: 'Author Z - A' },
  ];
  selectedOption: any;

  ngOnInit() {
    // set default sort options
    this.selectedOption = this.sortOptions[0];
  }

  /**
   * call api with different sort options
   *
   * @param {option} an object data of ngModelChange for form "select" element
   */
  sort(option) {
    this.sortChange.emit(option);
  }

  /**
   * load more api data
   *
   * @param {rows}
   */
  loadMoreAuthors() {
    this.loadMore.emit(true);
  }
}
