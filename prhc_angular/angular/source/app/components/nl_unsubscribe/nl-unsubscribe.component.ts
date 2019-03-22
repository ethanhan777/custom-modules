import {
  Component,
  OnInit,
  OnDestroy,
  Injectable
} from '@angular/core';
import { MWSApiService } from '../../services/mws_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { changePrefName } from '../../molecules/mlcl_nl_programs/mlcl-nl-programs.component';

export const nlUnsubscribeSelector = 'nl-unsubscribe';

@Component({
  selector: nlUnsubscribeSelector,
  templateUrl: './nl-unsubscribe.component.html',
})
@Injectable()
export class NlUnsubscribeComponent implements OnInit, OnDestroy {
  mcguid: string;
  pageTitle = 'The end?';
  pageSubtitle = 'You’ll miss out on hearing about new books, author features, and exclusive contests. ' +
                 'Are you sure you want to unsubscribe?';
  prefs = [];
  programs = [];
  programStatus = {};
  subscribtionStatus = true;
  userStatus = true;
  keepLabel = 'No, keep sending emails';
  errorMessage: string;
  confirmMessage = '';
  unsubscribeAll = false;
  private subscriptions = new Subscriber();


  constructor(private mwsApi: MWSApiService) {}

  ngOnInit() {
    const queryRaw = window.location.search;
    const queries = queryRaw.substring(1).split('&');

    queries.map(query => {
      const queryArr = query.split('=');
      if (queryArr[0] === 'mcg') {
        this.mcguid = decodeURIComponent(queryArr[1]);
      }
    });

    // for when user is an existing subscriber (update preference page)
    if (this.mcguid) {
      this.subscriptions.add(
        this.mwsApi
          .getUserProfileWithMcguid(this.mcguid)
          .subscribe(response => {
            if (response['data']) {
              if (response['data'].StatusCode === 1) {
                this.errorMessage = response['data'].Message;

              } else if (response['data'].Subscriber.Active === 0) {
                this.userStatus = false;
                this.errorMessage = 'You\'re already unsubscribed.';

              } else {
                this.prefs = response['data'].Programs[0].Preferences;
                if (this.prefs && this.prefs.length) {
                  this.prefs.map(pref => {
                    // 21026 == CASL
                    // 21051 === Author Alerts
                    pref.name = pref.Description;
                    pref.id = pref.PreferenceId;
                    if (
                      pref.PreferenceId !== 21026 &&
                      pref.SubscriberPrefValues &&
                      pref.PreferenceId !== 21051
                    ) {
                      this.programs.push(pref);
                      this.programStatus[pref.PreferenceId] = true;
                    }
                    if (pref.PreferenceId === 21051 && pref.SubscriberPrefValues) {
                      // display individual author preferences
                      this.programStatus[pref.PreferenceId] = {};
                       pref.SubscriberPrefValues.map(authorPref => {
                        if (authorPref.PreferenceKey !== 0) {
                          authorPref.parentId = pref.PreferenceId;
                          authorPref.name = authorPref.PreferenceText;
                          authorPref.PreferenceId = authorPref.PreferenceKey;
                          this.programs.push(authorPref);
                          this.programStatus[pref.PreferenceId][authorPref.PreferenceKey] = true;
                        }
                      });
                    }
                  });
                  changePrefName(this.prefs);
                }

                if (this.programs.length) {
                  this.keepLabel += ', but only on these topics';
                }
              }
            } else {
              this.errorMessage = 'something is wrong...';
            }
          })
      );
    } else {
      window.location.replace('/error/403');
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  updateStatus() {
    if (this.subscribtionStatus) {
      // update preferences
      this.mwsApi
        .setUserProfile(this.mcguid, {}, this.programStatus, this.prefs)
        .subscribe(res => {
          if (res['data'] && res['data'].StatusCode === 0) {
            this.pageTitle = 'Success!';
            this.pageSubtitle = undefined;
            this.confirmMessage = 'Your preferences have been updated. You will only hear from us about these interests.';
          }
        });
    } else {
      // unsubscibe
      this.mwsApi
        .setUserProfileUnsubscribe(this.mcguid)
        .subscribe(res => {
          if (res['data'] && res['data'].StatusCode === 0) {
            this.pageTitle = 'You have successfully unsubscribed';
            this.pageSubtitle = undefined;
            this.confirmMessage = 'You have been unsubscribed from Penguin Random House Canada’s email list. ' +
                                  'We’re sorry to see you go, but if you change your mind we’ll be here with great stories to share.' +
                                  '<br> If you still want to stay in the loop, follow us on social media.';
          }
        });
    }
  }

  checkSubscribe() {
    this.unsubscribeAll = !this.unsubscribeAll;
  }

  redirectToPrefCentre() {
    window.location.replace('/newsletter?mcg=' + this.mcguid);
  }
}
