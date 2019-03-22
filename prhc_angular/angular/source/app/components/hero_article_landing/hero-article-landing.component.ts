import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';

import { capitalizeString } from '../../services/common.service';
import {
  getCurrentContentInfo,
  parseBreadcrumb
} from '../../services/enhanced_api.service';
import { PrhcApiService } from '../../services/prhc_api.service';

export const heroArticleLandingSelector = 'hero-article-landing';

@Component({
  selector: heroArticleLandingSelector,
  templateUrl: './hero-article-landing.component.html',
})
@Injectable()
export class HeroArticleLandingComponent implements OnInit {
  pageTitle: string;
  breadcrumbItems = [];

  constructor (private prhcApi: PrhcApiService) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();
    this.prhcApi.getEntityId()
      .subscribe(response => {
          // api content pages.
          if (response['data'].vid && response['data'].name) {
            if (response['data'].vid === 'ingredients') {
              this.pageTitle =
                'Recipes with <span class="capitalize">' +
                capitalizeString(response['data'].name) +
                '</span>';
            } else {
              this.pageTitle = response['data'].name;
            }

            const recipeTaxonomies = ['recipe_categories', 'ingredients'];
            if (recipeTaxonomies.indexOf(response['data'].vid) > -1) {
              this.breadcrumbItems = parseBreadcrumb(response['data'].name, 'Recipes', '/recipes');
            }
          // non-api pages
          } else {
            this.pageTitle = capitalizeString(currentContentInfo.type);
          }
      });
  }
}
