import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';
import { PrhcApiService } from '../../services/prhc_api.service';


export const nodeCampaignPageSelector = 'node-campaign-page';

@Component({
  selector: nodeCampaignPageSelector,
  templateUrl: './node-campaign-page.component.html',
})
@Injectable()
export class NodeCampaignPageComponent implements OnInit, OnDestroy {
  campaign: any;
  private subscriptions = new Subscriber();

  constructor(
    private prhcApi: PrhcApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.prhcApi.getArticle('field_campaign_categories')
        .subscribe(response => {
          if (response.article['data'] && response.article['data'].length) {
            this.campaign = response.article;
            this.sendTealiumData(this.campaign);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendTealiumData(campaign) {
    const utagData = {
      'page_type': 'campaign',
      'page_name': campaign['data'][0].attributes.title,
    };

    if (campaign.included) {
      campaign.included.map(include => {
        if (include.type === 'taxonomy_term--campaign_categories') {
          utagData['category_type'] = include.attributes.name;
        }
      });
    }

    this.tealium.track('view', utagData);
  }
}
