import {
  Component,
  OnInit,
  Input,
  Injectable,
  OnDestroy
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import {
  PrhcApiService,
  parseCampaignList
} from '../../services/prhc_api.service';

@Component({
  selector: 'mlcl-campaign-category',
  templateUrl: './mlcl-campaign-category.component.html',
})
@Injectable()
export class MlclCampaignCategoryComponent implements OnInit, OnDestroy {
  @Input() data: any;
  private subscriptions = new Subscriber();
  heading = '';
  campaigns = [];

  constructor (private prhcApi: PrhcApiService) {}

  ngOnInit() {
    if (this.data.attributes.field_subheading) {
      this.heading = this.data.attributes.field_subheading;
    }

    this.subscriptions.add(
      this.prhcApi
        .getCampaignsByCategoryTerm(this.data.relationships.field_category.links.related)
        .subscribe(response => {
          // prepare campaign node list
          if (
            response.campaigns &&
            response.campaigns['data']
          ) {
            this.campaigns = parseCampaignList(response.campaigns);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
