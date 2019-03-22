import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'mlcl-saved-book-list',
  templateUrl: './mlcl-saved-book-list.component.html',
})
export class MlclSavedBookListComponent {
  @Input() group;
  @Output() removeIsbn = new EventEmitter<any>();

  removeBook(isbn) {
    // remove isbn from local storage
    this.removeIsbn.emit(isbn);
  }
}
