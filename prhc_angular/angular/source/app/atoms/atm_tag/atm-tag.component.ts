import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'atm-tag',
  templateUrl: './atm-tag.component.html',
})
export class AtmTagComponent {
  @Input() name: string;
  @Input() icon: string;
  @Input() iconBefore = false;
  @Input() iconAfter = false;
  @Input() active;
  @Input() seoFriendlyUrl: string;
  @Input() currentIsbn;
  @Output() clicked = new EventEmitter<any>();

  isClicked() {
    if (this.seoFriendlyUrl) {
      window.location.href = this.seoFriendlyUrl;
    }
    if (this.currentIsbn) {
      this.clicked.emit(this.currentIsbn);
    } else {
      this.clicked.emit(this.name);
    }
  }
}
