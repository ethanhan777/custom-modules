import {
  Component,
  Input,
  OnInit,
  Injectable,
  OnDestroy
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';

@Component({
  selector: 'mlcl-campaign-cta',
  templateUrl: './mlcl-campaign-cta.component.html',
})
@Injectable()
export class MlclCampaignCTAComponent implements OnInit, OnDestroy {
  @Input() cta;
  items = [];
  private subscriptions = new Subscriber();

  constructor ( private prhcApi: PrhcApiService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.prhcApi
        .getData(this.cta.relationships.field_cta_warpper.links.related)
        .subscribe(response => {
          if (response['data'] && response['data'].length) {
            response['data'].map(cta => {
              this.items.push(cta);
            });
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
