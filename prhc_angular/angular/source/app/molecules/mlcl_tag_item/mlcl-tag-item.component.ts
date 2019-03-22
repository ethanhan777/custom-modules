import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'mlcl-tag-item',
  templateUrl: './mlcl-tag-item.component.html',
})
export class MlclTagItemComponent {
  @Input() label: string;
  @Input() tags;
  @Input() currentIsbn: string;
  @Output() clicked = new EventEmitter<any>();

  isClicked(clickedValue) {
    this.clicked.emit(clickedValue);
  }
}
