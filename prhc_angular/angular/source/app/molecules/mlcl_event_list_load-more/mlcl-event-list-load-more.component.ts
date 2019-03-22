import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'mlcl-event-list-load-more',
  templateUrl: './mlcl-event-list-load-more.component.html',
})
export class MlclEventListLoadMoreComponent {
  @Input() events = [];
  @Input() loading = false;
  @Input() loadMoreFlag = false;
  @Output() loadMore = new EventEmitter<any>();

  loadMoreEvents() {
    this.loadMore.emit(true);
  }
}
