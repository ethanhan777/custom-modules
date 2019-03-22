import {
  Component,
  OnInit,
  Input,
  Injectable
} from '@angular/core';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';
import { TealiumUtagService } from '../../services/utag.service';

@Component({
  selector: 'mlcl-author-social-links',
  templateUrl: './mlcl-author-social-links.component.html',
})
@Injectable()
export class MlclAuthorSocialLinksComponent implements OnInit {
  @Input() author;
  label: string;
  socialLinks = [];

  constructor ( private tealium: TealiumUtagService ) {}

  ngOnInit() {
    if (this.author.label) {
      this.label = this.author.label;
    } else {
      this.label = `Connect with ${this.author.display}`;
    }
    if (this.author &&
      this.author.relatedLinks &&
      this.author.relatedLinks.length) {
      this.author.relatedLinks
      .map(link => {
        if (
          link.linkAttr === 19000 ||
          link.linkAttr === 17000 ||
          link.linkAttr === 23000 ||
          link.pinterest
        ) {
          // facebook
          const socialLink = {
            label: '',
            icon: '',
            seoFriendlyUrl: link.url,
            windowWidth: link.windowWidth,
            windowHeight: link.windowHeight,
            share: link.share,
          };

          // facebook
          if (link.linkAttr === 17000) {
            socialLink.icon = 'facebook';
            if (link.label) {
              socialLink.label = link.label;
            } else {
              socialLink.label = 'Follow on Facebook';
            }
          }

          // twitter
          if (link.linkAttr === 19000) {
            socialLink.icon = 'twitter';
            socialLink.windowWidth = link.windowWidth;
            socialLink.windowHeight = link.windowHeight;
            if (link.label) {
              socialLink.label = link.label;
            } else {
              socialLink.label = 'Follow on Twitter';
            }
          }

          // instagram
          if (link.linkAttr === 23000) {
            socialLink.icon = 'instagram';
            socialLink.label = 'Follow on Instagram';
          }

          // pinterest for imprints
          if (link.pinterest === true) {
            socialLink.icon = 'pinterest-p';
            if (link.label) {
              socialLink.label = link.label;
            } else {
              socialLink.label = 'Follow on Pinterest';
            }
          }

          this.socialLinks.push(socialLink);
        }
      });
    }
  }

  onClick(icon) {
    const currentContentInfo = getCurrentContentInfo();

    let moduleType = 'Author Social Follows';
    if (currentContentInfo.type === 'imprints') {
      moduleType = 'Imprint Social Follows';
    } else if (currentContentInfo.type === 'book-finder') {
      moduleType = 'Social Share';
    }

    this.tealium.track('link', {
      'module_type': moduleType,
      'module_variation': icon,
    });
  }
}
