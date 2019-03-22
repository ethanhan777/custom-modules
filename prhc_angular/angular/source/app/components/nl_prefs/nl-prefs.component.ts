import {
  Component,
  OnInit,
  Injectable,
  OnDestroy
} from '@angular/core';
import { MWSApiService } from '../../services/mws_api.service';
import { isValidEmail } from '../../services/common.service';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

export const nlPrefsSelector = 'nl-prefs';

@Component({
  selector: nlPrefsSelector,
  templateUrl: './nl-prefs.component.html',
})
@Injectable()
export class NlPrefsComponent implements OnInit, OnDestroy {
  loading = false;
  isDataEmpty = true;
  mcguid = '';
  subscriber: any;
  programs = [];
  prefStatus = {};
  // userPrefs = [];
  message: string;
  errorMessage: string;
  legalFlag = false;
  pageTitle = 'Your next great read awaits';
  pageSubtitle = 'Sign up to receive the latest book and author news, plus access to exclusive giveaways, and personalized recommendations';
  private subscriptions = new Subscriber();
  private utagLink = {
    'event_type': 'newsletter_signup',
    'newsletter_name': '210 | 21001',
    'pid': '',
    'newsletter_acquisition_code': 'RHCANADA_PREFERENCE-CENTER_STATIC_071818',
  };

  constructor(
    private mwsApi: MWSApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    const queryRaw = window.location.search;
    const queries = queryRaw.substring(1).split('&');

    queries.map(query => {
      const queryArr = query.split('=');
      if (queryArr[0] === 'mcg') {
        this.mcguid = decodeURIComponent(queryArr[1]);
      }
    });

    this.tealium.track('view', {
      'page_type': 'Preference Center',
      'page_name': this.mcguid && this.mcguid.length > 0 ? 'Manage Preferences' : 'Sign Up',
    });

    // for when user is an existing subscriber (update preference page)
    if (this.mcguid.length > 0) {
      this.pageTitle = 'What do you read?';
      this.pageSubtitle = 'Tell us what you love to read and we’ll make sure you never miss a good story';
      this.getUserProfile();

    // for when user is not an existing subscriber (sign up page)
    } else {
      this.subscriptions.add(
        this.mwsApi
          .getPreferences()
          .subscribe(response => {
            // tslint:disable-next-line:forin
            for (const key in response['data']) {
              this.programs.push(response['data'][key]);
            }
            this.setPrefStatus();
            // send empty subscriber
            this.subscriber = {
              Email: '',
              FirstName: '',
              LastName: '',
              Pc: '',
            };
          })
      );
    }
    this.loading = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  isValidForm(legalFlag?) {
    if (legalFlag || legalFlag === false) {
      this.legalFlag = legalFlag;
    }

    if (
      this.mcguid.length ||
      (this.legalFlag &&
      this.subscriber.Email.length > 0 &&
      isValidEmail(this.subscriber.Email))
    ) {
      return true;
    }

    return false;
  }

  signup() {
    this.loading = true;
    if (this.mcguid.length === 0) {
      this.subscriptions.add(
        this.mwsApi
          .subscribeService(
            this.subscriber,
            this.utagLink.newsletter_acquisition_code,
            this.prefStatus
          )
          .subscribe(response => {
            response['data']['Msg'].map(guid => {
              this.mcguid = guid.MasterContactGuid;
            });

            if (this.mcguid.length) {
              // send tealium
              this.utagLink.pid = this.mcguid;
              this.tealium.track('link', this.utagLink);

              this.getUserProfile();
            }

            this.loading = false;
            this.pageTitle = 'Thanks for signing up!';
            this.pageSubtitle = undefined;
            this.message =
              'Watch your inbox for great reads tailored to your tastes. ' +
              'Can’t wait for your first email? Browse our <a href="/new-releases">newest releases</a> or follow us on social media.';
          })
      );
    } else {
      this.setUserProfile();
    }
  }

  getUserProfile() {
    this.mwsApi
      .getUserProfileWithMcguid(this.mcguid)
      .subscribe(response => {
        if (response['data']) {
          if (response['data'].StatusCode === 1) {
            this.errorMessage = response['data'].Message;
          } else {
            this.isDataEmpty = false;
            this.subscriber = response['data'].Subscriber;
            this.programs = response['data'].Programs[0].Preferences;
          }
        } else {
          this.errorMessage = 'something is wrong...';
        }
        this.setPrefStatus();

        this.loading = false;
      });
  }

  setUserProfile() {
    this.loading = true;

    this.subscriptions.add(
      this.mwsApi
        .setUserProfile(this.mcguid, this.subscriber, this.prefStatus, this.programs)
        .subscribe(response => {
          if (!response['data'] || response['data'].StatusCode === 1) {
            this.errorMessage = response['data'].Message;
          } else {
            // send tealium
            this.utagLink.pid = this.mcguid;
            this.tealium.track('link', this.utagLink);

            this.loading = false;
            this.pageTitle = 'You’re all set!';
            this.pageSubtitle = undefined;
            this.message = 'Watch your inbox for great reads tailored to your tastes';
          }
        })
    );
  }

  setPrefStatus() {
    this.programs.map(pref => {
      if (!pref.id && pref.PreferenceId) {
        pref.id = pref.PreferenceId;
      }
      if (!pref.name && pref.Description) {
        pref.name = pref.Description;
      }

      this.prefStatus[pref.id] = false;
      if (
        pref.SubscriberPrefValues &&
        pref.SubscriberPrefValues[0].Active === 1
      ) {
        this.prefStatus[pref.id] = true;

        if (pref.PreferenceId === 21051) {
          this.prefStatus[pref.PreferenceId] = {};
          pref.SubscriberPrefValues.map(sub => {
            if (sub.PreferenceKey !== 0) {
              this.prefStatus[pref.PreferenceId][sub.PreferenceKey] = true;
            }
          });
        }
      }
    });
  }

  upateUserProfile(updatedUserProfile) {
    this.subscriber = updatedUserProfile;
  }

  updateUserPreferences(prefParamsArray) {
    this.prefStatus = prefParamsArray;
  }

  onClick() {
    this.message = '';
  }

}
