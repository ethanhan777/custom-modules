import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { scrollToClass } from '../../services/scroll.service';

@Component({
  selector: 'mlcl-pagination-alphabet',
  templateUrl: './mlcl-pagination-alphabet.component.html',
})
export class MlclPaginationAlphabetComponent implements OnInit {
  data = [];
  @Input() activePage = 'A';
  @Input() type: string;
  @Input() scrollPoint;
  @Output() start = new EventEmitter<any>();

  ngOnInit() {
    const pagination = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
    pagination.map(alphabet => {
      if (this.activePage === alphabet) {
        this.data.push({ name: alphabet, active: true });
      } else {
        this.data.push({ name: alphabet });
      }
    });
  }

  /**
   * send parent component the api filter value (author last initial).
   *
   * @param {start} page number that was clicked.
   */
  newPage(start) {
    // don't trigger for current page number.
    if (start !== this.activePage) {
      // scroll to top page
      scrollToClass(this.scrollPoint);

      // update active page
      this.activePage = start;
      // change which letter has the active class
      this.data.map(alphabet => {
        if (alphabet.name !== this.activePage && alphabet.active === true) {
          alphabet.active = false;
        } else if (alphabet.name === this.activePage) {
          alphabet.active = true;
        }
      });
      // send parent the new start point.
      this.start.emit(start);
    }
  }
}
