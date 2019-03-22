import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';
import { TealiumUtagService } from '../../services/utag.service';
import { PrhcApiService } from '../../services/prhc_api.service';


export const landingDrupalPageSelector = 'landing-drupal-page';

@Component({
  selector: landingDrupalPageSelector,
  templateUrl: './landing-drupal-page.component.html',
})
@Injectable()
export class LandingDrupalPageComponent implements OnInit, OnDestroy {
  pageType = 'features';
  private subscriptions = new Subscriber();

  constructor(
    private prhcApi: PrhcApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();

    if (currentContentInfo.type) {
      this.pageType = currentContentInfo.type;
    }

    this.subscriptions.add(
      this.prhcApi.getEntityId()
        .subscribe(response => {
            // api content pages.
            const taxonomy = {
              'vid': '',
              'name': '',
            };
            if (response['data'].vid && response['data'].name) {
              taxonomy.vid = response['data'].vid;
              taxonomy.name = response['data'].name;
            }

            const recipeTaxonomies = ['recipe_categories', 'ingredients'];
            if (response['data'].vid === 'global_categories') {
              this.pageType = 'features';
            } else if (recipeTaxonomies.indexOf(response['data'].vid) > -1) {
              this.pageType = 'recipes';
            }

            this.sendTealiumData(this.pageType, taxonomy);
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendTealiumData(type, taxonomy?) {
    const utagData = {
      'page_type': type,
      'page_name': type + '-landing',
    };

    if (taxonomy.vid === 'global_categories') {
      utagData.page_type = 'article_categories';
      utagData.page_name = taxonomy.name;
    }

    if (taxonomy.vid === 'recipe_categories') {
      utagData.page_type = 'recipe_categories';
      utagData.page_name = taxonomy.name;
    }

    if (taxonomy.vid === 'ingredients') {
      utagData.page_type = 'recipe_ingredients';
      utagData.page_name = taxonomy.name;
    }

    if (type === 'about') {
      utagData.page_type = 'About Penguin Random House Canada';
      utagData.page_name = 'About Penguin Random House Canada';
    }

    this.tealium.track('view', utagData);
  }
}
