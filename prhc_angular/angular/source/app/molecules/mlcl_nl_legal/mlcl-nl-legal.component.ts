import {
  Component,
  Output,
  EventEmitter,
  Input
} from '@angular/core';

@Component({
  selector: 'mlcl-nl-legal',
  templateUrl: './mlcl-nl-legal.component.html',
})
export class MlclNlLegalComponent {
  @Output() isAgreed = new EventEmitter<any>();
  @Input () required: boolean;
  legalCheckbox = false;
  spamCheckbox = false;

  legalCheckboxChange() {
    if (!this.spamCheckbox) {
      this.isAgreed.emit(this.legalCheckbox);
    }
  }

  spamCheckboxChange() {
    this.isAgreed.emit(!this.spamCheckbox);
  }
}
