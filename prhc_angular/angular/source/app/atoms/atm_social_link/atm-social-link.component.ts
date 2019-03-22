import {
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'atm-social-link',
  templateUrl: './atm-social-link.component.html',
})
export class AtmSocialLinkComponent implements OnInit {
  @Input() seoFriendlyUrl: string;
  @Input() icon = 'facebook';
  @Input() label = '';
  @Input() windowWidth = 600;
  @Input() windowHeight = 860;
  @Input() socialPage: boolean;
  pinterestButton = false;

  ngOnInit() {
    if (this.icon === 'pinterest-p') {
      this.pinterestButton = true;
    }
  }

  buttonClicked() {
    if (this.seoFriendlyUrl && !this.socialPage) {
      window.open(this.seoFriendlyUrl, '_blank', 'width=' + this.windowWidth + ',height=' + this.windowHeight);
    }
  }
}
