import {
  Component,
  OnInit,
  OnDestroy,
  Injectable
} from '@angular/core';
import {
  PrhcApiService,
  getNavTitles
} from '../../services/prhc_api.service';
import { convertStrToUrl } from '../../services/common.service';
import { Subscriber } from 'rxjs/Subscriber';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';
import { TealiumUtagService } from '../../services/utag.service';

export const campaignNavSelector = 'campaign-nav';

@Component({
  selector: campaignNavSelector,
  templateUrl: './campaign-nav.component.html',
})
@Injectable()
export class CampaignNavComponent implements OnInit, OnDestroy {
  isLoaded = false;
  nav = [];
  currentType: string;
  private currentContentInfo = getCurrentContentInfo();
  // private currentPath = window.location.pathname;
  // currentType = this.currentPath.split('/')[1];
  // private currentCode = this.currentPath.split('/')[2];
  private subscriptions = new Subscriber();

  constructor (
    private prhcApi: PrhcApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    const currentPath = window.location.pathname;
    this.currentType = this.currentContentInfo.type;

    if (this.currentType === 'imprints') {
      const autoLinks = [{
        name: 'Books',
        seoFriendlyUrl: currentPath + '/books',
      },
      {
        name: 'Authors',
        seoFriendlyUrl: currentPath + '/authors',
      }];
      autoLinks.map(link => {
        this.nav.push(link);
      });

      // get imprint content to display about link
      this.subscriptions.add(
        this.prhcApi
          .getImprint(this.currentContentInfo.id)
          .subscribe(response => {
            if (response['data'] && response['data'].length) {
              response['data'].map(imprint => {
                // Link to about page
                if (imprint.attributes.field_about_section_title) {
                  const aboutLink = {
                    name: imprint.attributes.field_about_section_title,
                    seoFriendlyUrl: currentPath + '/about'
                  };
                  this.nav.unshift(aboutLink);
                }
              });
            }
            this.isLoaded = true;
          })
      );
    } else {
      this.subscriptions.add(
      this.prhcApi.getArticle('field_category')
        .map(response => {
          return getNavTitles(response.article);
        })
        .subscribe(response => {
          if (response && response.length) {
            response.map(navLable => {
              this.nav.push({
                name: navLable,
                seoFriendlyUrl: '#' + convertStrToUrl(navLable),
              });
            });
            this.isLoaded = true;
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  redirect(label) {
    let moduleType = 'Campaign Navigation';
    if (this.currentContentInfo.type === 'imprints') {
      moduleType = 'Imprint Navigation';
    }

    this.tealium.track('link', {
      'module_type': moduleType,
      'module_variation': label,
    });

  }


}

