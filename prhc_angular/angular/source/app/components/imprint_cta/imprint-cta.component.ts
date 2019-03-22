import {
  Component,
  Injectable,
  OnInit,
  OnDestroy
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const imprintCtaSelector = 'imprint-cta';

@Component({
  selector: imprintCtaSelector,
  templateUrl: './imprint-cta.component.html',
})
@Injectable()
export class ImprintCtaComponent implements OnInit, OnDestroy {
  isLoaded = false;
  campaignComponents = [];
  private currentId = window.location.pathname.split('/')[2];
  private subscriptions = new Subscriber();

  constructor ( private prhcApi: PrhcApiService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.prhcApi.getImprint(this.currentId)
        .subscribe(response => {
          if (
            response['included'] &&
            response['included'].length
          ) {
            response['included'].map(cta => {
              if (cta.type === 'paragraph--cta_warpper') {
                this.campaignComponents.push(cta);
              }
            });
          }
      })
   );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
