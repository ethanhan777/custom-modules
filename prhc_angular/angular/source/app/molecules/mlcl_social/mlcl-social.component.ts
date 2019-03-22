import {
  Component,
  OnInit,
  Input,
  Injectable
} from '@angular/core';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';
import { TealiumUtagService } from '../../services/utag.service';


@Component({
  selector: 'mlcl-social',
  templateUrl: './mlcl-social.component.html',
})
@Injectable()
export class MlclSocialComponent implements OnInit {
  @Input() tealiumData: any;
  socialLinks = [];

  constructor ( private tealium: TealiumUtagService ) {}

  ngOnInit() {
    const current_url = window.location.href;
    const encoded_url = encodeURIComponent(current_url);

    // facebook
    this.socialLinks.push({
      seoFriendlyUrl: 'https://www.facebook.com/sharer/sharer.php?u=' + encoded_url,
      windowWidth: 600,
      windowHeight: 350,
      icon: 'facebook',
    });

    // twiter
    this.socialLinks.push({
      seoFriendlyUrl: 'https://twitter.com/intent/tweet?url=' + encoded_url,
      windowWidth: 600,
      windowHeight: 350,
      icon: 'twitter',
    });

    // pinterest
    this.socialLinks.push({
      seoFriendlyUrl: 'https://www.pinterest.com/pin/create/button/',
      icon: 'pinterest-p',
    });
  }

  onClick(icon) {
    const currentContentInfo = getCurrentContentInfo();
    let shareType = currentContentInfo.type;
    if (currentContentInfo.bookContent) {
      shareType = currentContentInfo.bookContent;
    }

    const utagLink = {
      'event_type': 'post_share',
      'social_platform': icon,
      'share_type': shareType,
    };

    if (this.tealiumData && this.tealiumData.title) {
      utagLink['event_type'] = 'product_share';
      utagLink['share_title'] = this.tealiumData.title;
      utagLink['product_isbn'] = this.tealiumData.isbn;
      utagLink['product_work_id'] = this.tealiumData.workId;
    }

    this.tealium.track('link', utagLink);
  }
}
