import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'atm-social-label',
  templateUrl: './atm-social-label.component.html',
})
export class AtmSocialLabelComponent {
  @Input() label: string;
  @Input() seoFriendlyUrl = '';
  @Input() icon = 'facebook';
  @Input() share = false;
  @Input() windowWidth = 600;
  @Input() windowHeight = 860;

  buttonClicked() {
    if (this.seoFriendlyUrl && this.share) {
      window.open(this.seoFriendlyUrl, '_blank', 'width=' + this.windowWidth + ',height=' + this.windowHeight);
    }
  }
}
