import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { scrollToClass } from '../../services/scroll.service';

@Component({
  selector: 'mlcl-pagination',
  templateUrl: './mlcl-pagination.component.html',
})
export class MlclPaginationComponent implements OnInit {
  @Input() rows;
  @Input() resultCount;
  @Input() currentStart;
  @Input() scrollPoint;
  @Output() start = new EventEmitter<any>();
  pagination: any[] = [];
  activePage: any;
  pageNumber: any;
  lastPageNumber: any;

  ngOnInit() {
    this.pageNumber =
      this.currentStart === 0 ? 0 : this.currentStart / this.rows;
    this.lastPageNumber = this.resultCount
      ? Math.ceil(this.resultCount / this.rows)
      : 0;
    this.activePage = this.pageNumber + 1;

    if (this.lastPageNumber > 5) {
      // first page
      if (this.pageNumber === 0) {
        for (let i = this.pageNumber; i < this.pageNumber + 5; i++) {
          this.pagination.push(i + 1);
        }
      } else if (this.pageNumber === 1) {
        for (let i = this.pageNumber - 1; i < this.pageNumber; i++) {
          this.pagination.push(i + 1);
        }
        for (let i = this.pageNumber; i < this.pageNumber + 4; i++) {
          this.pagination.push(i + 1);
        }
      } else if (this.pageNumber === this.lastPageNumber - 2) {
        for (let i = this.pageNumber - 3; i < this.pageNumber; i++) {
          this.pagination.push(i + 1);
        }
        for (let i = this.pageNumber; i < this.pageNumber + 2; i++) {
          this.pagination.push(i + 1);
        }
      } else if (this.pageNumber === this.lastPageNumber - 1) {
        for (let i = this.pageNumber - 4; i <= this.pageNumber; i++) {
          this.pagination.push(i + 1);
        }
      } else {
        for (let i = this.pageNumber - 2; i < this.pageNumber; i++) {
          this.pagination.push(i + 1);
        }
        for (let i = this.pageNumber; i < this.pageNumber + 3; i++) {
          this.pagination.push(i + 1);
        }
      }
    } else {
      for (let i = 0; i < this.lastPageNumber; i++) {
        this.pagination.push(i + 1);
      }
    }
  }

  /**
   * send parent component the calculated start point for api filter.
   *
   * @param {start} page number that was clicked.
   */
  newPage(start) {
    // scroll to top page
    scrollToClass('mlcl_header');

    start = start - 1;
    // don't trigger for current page number.
    if (start !== this.currentStart) {
      // send parent the new start point.
      this.start.emit(start * this.rows);
    }
  }

  /**
   * send parent component the calculated start point of next batch
   * for api filter.
   */
  prevPage() {
    // scroll to top page
    scrollToClass('mlcl_header');
    // send parent the new start point
    this.start.emit((this.pageNumber - 1) * this.rows);
  }

  /**
   * send parent component the calculated start point of previous batch
   * for api filter.
   */
  nextPage() {
    // scroll to top page
    scrollToClass('mlcl_header');
    // send parent the new start point
    this.start.emit((this.pageNumber + 1) * this.rows);
  }
}
