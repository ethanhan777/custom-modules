import {
  Component,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'atm-button',
  templateUrl: './atm-button.component.html',
})
export class AtmButtonComponent {
  @Input() label: string;
  @Input() seoFriendlyUrl = '';
  @Input() classes = '';
  @Input() windowFlag = false;
  @Input() windowWidth = 600;
  @Input() windowHeight = 860;
  @Input() externalFlag = false;
  @Input() iconInFront = false;
  @Input() icon;
  @Input() isDisabled = false;
  @Output() clicked = new EventEmitter<any>();

  buttonClicked() {
    if (this.seoFriendlyUrl) {
      if (this.windowFlag) {
        window.open(this.seoFriendlyUrl, '_blank', 'width=' + this.windowWidth + ',height=' + this.windowHeight);
      } else if (this.externalFlag) {
        // window.location.href = this.seoFriendlyUrl;
        const win = window.open(this.seoFriendlyUrl, '_blank');
        win.focus();
      } else {
        window.location.href = this.seoFriendlyUrl;
      }
    }

    if (event) {
      event.preventDefault();
    }
    this.clicked.emit(this.label);
  }
}
