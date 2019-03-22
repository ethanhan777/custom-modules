import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'mlcl-campaign-retailer-links',
  templateUrl: './mlcl-campaign-retailer-links.component.html',
})
export class MlclCampaignRetailerLinksComponent {
  @Input() heading;
  @Input() isbn;
  lightboxOn = false;

  lightbox(status) {
    this.lightboxOn = status;
    if (status) {
      document.getElementsByTagName('body')[0].classList.add('cmpnt_lightbox-open');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('cmpnt_lightbox-open');
    }
  }

  keepLightboxOn(event) {
    event.stopPropagation();
  }

}
