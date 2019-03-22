import {
  Component,
  Injectable,
  Input,
  OnInit
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';

import {
  PrhcApiService,
  sortListCampaigns
} from '../../services/prhc_api.service';
import { TealiumUtagService } from '../../services/utag.service';

@Component({
  selector: 'mlcl-reco-curated-picks',
  templateUrl: './mlcl-reco-curated-picks.component.html',
})
@Injectable()
export class MlclRecoCuratedPicksComponent implements OnInit {
  @Input() recomendationMappingTerms = [];
  private subscriptions = new Subscriber();
  curatedPickItems = [];

  constructor (
    private prhcApi: PrhcApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.prhcApi.getListCampaigns()
      .subscribe(response => {
        if (response && response.length) {
          this.curatedPickItems = sortListCampaigns(
            response,
            this.recomendationMappingTerms
          );
        }
      })
    );
  }

  sendTealiumData(title) {
    this.tealium.track('link', {
      'module_type': 'Curated Campaign Slider',
      'module_variation': title,
    });
  }

}
