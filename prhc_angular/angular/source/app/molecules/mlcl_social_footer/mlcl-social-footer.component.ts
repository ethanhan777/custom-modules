import {
  Component,
  OnInit,
} from '@angular/core';


@Component({
  selector: 'mlcl-social-footer',
  templateUrl: './mlcl-social-footer.component.html',
})
export class MlclSocialFooterComponent implements OnInit {
  socialLinks = [];

  ngOnInit() {
    // facebook
    this.socialLinks.push({
      icon: 'facebook',
      seoFriendlyUrl: 'https://www.facebook.com/PenguinRandomCA/',
    });

    // instagram
    this.socialLinks.push({
      icon: 'instagram',
      seoFriendlyUrl: 'https://www.instagram.com/penguinrandomca/',
    });

    // twiter
    this.socialLinks.push({
      icon: 'pinterest-p',
      seoFriendlyUrl: 'https://www.pinterest.ca/penguinrandomca/',
    });

    // email
    this.socialLinks.push({
      icon: 'twitter',
      seoFriendlyUrl: 'https://twitter.com/PenguinRandomCA',
    });
  }
}
