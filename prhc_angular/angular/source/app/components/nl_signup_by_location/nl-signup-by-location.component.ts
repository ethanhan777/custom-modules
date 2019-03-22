import {
  Component,
  OnInit,
  OnDestroy,
  Injectable
} from '@angular/core';
import { MWSApiService } from '../../services/mws_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

export const nlSignupByLocationSelector = 'nl-signup-by-location';

@Component({
  selector: nlSignupByLocationSelector,
  templateUrl: './nl-signup-by-location.component.html',
})
@Injectable()
export class NlSignupByLocationComponent implements OnInit, OnDestroy {
  mcguid: string;
  email = '';
  postalCode = '';
  headerLabel: string;
  private subscriptions = new Subscriber();
  private utagLink = {
    'event_type': 'newsletter_signup',
    'newsletter_name': '210 | 21001',
    'pid': '',
    'newsletter_acquisition_code': 'RHCANADA_PRH-CANADA-EVENTS_EMBEDDED_071818',
  };

  constructor(
    private mwsApi: MWSApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    this.headerLabel = 'Get updates about author events and appearances near you.';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setMcguid(userInfo) {
    this.subscriptions.add(
      this.mwsApi
        .subscribeService(userInfo, this.utagLink.newsletter_acquisition_code)
        .subscribe(response => {
          response['data']['Msg'].map(guid => {
            this.mcguid = guid.MasterContactGuid;

            // send tealium
            this.utagLink.pid = this.mcguid;
            this.tealium.track('link', this.utagLink);
          });
        })
    );
  }
}
