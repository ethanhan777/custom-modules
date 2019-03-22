import {
  Component,
  OnInit,
  OnDestroy,
  Injectable
} from '@angular/core';
import { MWSApiService } from '../../services/mws_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

export const nlSignupSelector = 'nl-signup';

@Component({
  selector: nlSignupSelector,
  templateUrl: './nl-signup.component.html',
})
@Injectable()
export class NlSignupComponent implements OnInit, OnDestroy {
  isLoaded = false;
  mcguid = '';
  email = '';
  headerLabel: string;
  private subscriptions = new Subscriber();
  private utagLink = {
    'event_type': 'newsletter_signup',
    'newsletter_name': '210 | 21001',
    'pid': '',
    'newsletter_acquisition_code': 'RHCANADA_SITE-FOOTER_STATIC_071818',
  };

  // animation
  private footerForm = false;
  private scrollPos = 0;
  relativePos = '';
  private totalHeight = 0;
  private pageHeight = 0;
  private newsletterHeight = 0;
  private footerHeight = 0;
  alreadyMember = false;

  constructor(
    private mwsApi: MWSApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    this.headerLabel = 'Sign up for our newsletter and discover your next great read';
    this.isLoaded = true;

    if (sessionStorage.getItem('global-sign-up')) {
      this.alreadyMember = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // Detect the scroll position,
  // reopen and make relative position at bottom of page
  footerFormScroll() {
    this.scrollPos = window.scrollY;
    this.totalHeight = document.body.scrollHeight - window.innerHeight;
    this.newsletterHeight = document.getElementById('cmpntFooter').offsetHeight;
    this.footerHeight = document.getElementById('cmpnt_footer').offsetHeight;
    this.pageHeight =
      this.totalHeight - this.newsletterHeight - this.footerHeight - 5;
    if (this.scrollPos > this.pageHeight) {
      this.footerForm = true;
      this.relativePos = 'atm_form-relative';
    }  else {
      this.relativePos = 'atm_form-hidden';
    }
  }

  // Open and close the footer on click
  footerFormOn(toggle) {
    this.footerForm = toggle;
    if (this.footerForm === true) {
      this.relativePos = 'cmpnt_footer-sign-up-fixed';
    } else {
      this.relativePos = 'atm_form-hidden';
    }
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
    // set session storage so it won't stay sticky for users who have signed up already
    sessionStorage.setItem('global-sign-up', 'true');
  }
}
