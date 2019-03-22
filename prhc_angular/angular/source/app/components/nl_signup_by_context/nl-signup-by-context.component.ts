import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Injectable,
  EventEmitter,
  Output,
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { MWSApiService, getPrefCodeByCatId } from '../../services/mws_api.service';
import {
  getCurrentContentInfo,
  EnhancedApiService
} from '../../services/enhanced_api.service';
import { PrhcApiService } from '../../services/prhc_api.service';
import { TealiumUtagService } from '../../services/utag.service';

export const nlSignupByContextSelector = 'nl-signup-by-context';

@Component({
  selector: nlSignupByContextSelector,
  templateUrl: './nl-signup-by-context.component.html',
})
@Injectable()
export class NlSignupByContextComponent implements OnInit, OnDestroy {
  @Input() content: any;
  @Input() contentType: string;
  @Input() signupButtonFlag = true;
  @Input() prefCode = [];
  @Input() acquisitoinCode: string;
  @Output() stepAction = new EventEmitter<any>();
  contentId: string;
  mcguid: string;
  headerLabel: string;
  prefNames = [];
  isLoaded = true;
  private subscriptions = new Subscriber();
  private utagLink = {
    'event_type': 'newsletter_signup',
    'newsletter_name': '210 | 21001',
    'pid': '',
    'newsletter_acquisition_code': '',
  };

  constructor (
    private mwsApi: MWSApiService,
    private prhcApi: PrhcApiService,
    private enhanced: EnhancedApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    if (this.acquisitoinCode) {
      this.utagLink.newsletter_acquisition_code = this.acquisitoinCode;

      this.mwsApi
        .getPreferences()
        .subscribe(resp => {
          if (resp && resp['data'] && this.prefCode.length) {
            this.prefCode.map(code => {
              this.prefNames.push(resp['data'][code].name);
            });
          }
        });
    } else {
      this.prhcApi
        .getEntityId()
        .subscribe(response => {
          if (
            (response['data'].type && response['data'].type === 'article') ||
            (response['data'].vid && response['data'].vid === 'global_categories')
          ) {
            this.prefCode = ['21050'];
            this.prefNames.push('Behind the Scenes');
            this.headerLabel = 'Get access to behind-the-scenes features and news about our books and authors';
            this.utagLink.newsletter_acquisition_code = 'RHCANADA_BEHIND-THE-SCENES_EMBEDDED_071818';
          } else if (
            (response['data'].type && response['data'].type === 'recipe') ||
            (response['data'].vid && (
              response['data'].vid === 'recipe_categories' ||
              response['data'].vid === 'ingredients'))
          ) {
            this.prefCode = ['21016'];
            this.prefNames.push('Cooking');
            this.headerLabel = 'Discover recipes and other cookbooks like this, author features, and more!';
            this.utagLink.newsletter_acquisition_code = 'RHCANADA_CATEGORY_EMBEDDED_071818';
          } else {
            this.setAttributes();
          }
        });
    }
  }

  setAttributes() {
    if (this.content && this.contentType) {
      switch (this.contentType) {
        case 'events':
          this.headerLabel = 'Sign up to hear about more events in your area';
          this.utagLink.newsletter_acquisition_code = 'RHCANADA_PRH-CANADA-EVENTS_EMBEDDED_071818';
          break;

        case 'authors':
          this.headerLabel = 'Get news about authors like ' +
            this.content.display +
            ', popular books, and more!';
          this.prefCode = ['21051,' + this.content.authorId + ',' + this.content.display];
          this.prefNames.push(this.content.display);
          this.utagLink.newsletter_acquisition_code = 'RHCANADA_AUTHOR-ALERTS_EMBEDDED_071818';
          break;

        case 'book-finder':
          this.prefCode = ['21050'];
          this.prefNames.push('Behind the Scenes');
          this.headerLabel = this.content.headerLabel;
          this.utagLink.newsletter_acquisition_code = 'RHCANADA_GIFT-GUIDE-2018_EMEDDED_111518';
          break;
      }
    } else {
      const currentContentInfo = getCurrentContentInfo();
      this.contentType = currentContentInfo.type;
      switch (this.contentType) {
        case 'books':
          this.headerLabel = 'Discover other books like this, author exclusives, and more!';
          this.utagLink.newsletter_acquisition_code = 'RHCANADA_CATEGORY_EMBEDDED_071818';
          break;

        case 'series':
          this.subscriptions.add(
            this.enhanced
              .getSeriesCategories()
              .subscribe(response => {
                if (response['recordCount'] && response['recordCount'] > 0) {
                  this.headerLabel = 'Discover other books like this, author exclusives, and more!';
                } else {
                  this.isLoaded = false;
                }

              })
          );
          this.contentId = currentContentInfo.id;
          this.utagLink.newsletter_acquisition_code = 'RHCANADA_CATEGORY_EMBEDDED_071818';
          break;

        case 'authors':
          if (!currentContentInfo.id) {
            this.headerLabel = 'Get the latest releases, plus author features, and more straight to your inbox';
            this.prefCode = ['21048'];
            this.prefNames.push('New Releases');
            this.utagLink.newsletter_acquisition_code = 'RHCANADA_NEW-RELEASES_EMBEDDED_071818';
          }
          break;

        case 'new-releases':
          this.headerLabel = 'Get the latest releases, plus author features, and more straight to your inbox';
          this.prefCode = ['21048'];
          this.prefNames.push('New Releases');
          this.utagLink.newsletter_acquisition_code = 'RHCANADA_NEW-RELEASES_EMBEDDED_071818';
          break;

        case 'coming-soon':
          this.headerLabel = 'Get the latest releases, plus author features, and more straight to your inbox';
          this.prefCode = ['21048'];
          this.prefNames.push('New Releases');
          this.utagLink.newsletter_acquisition_code = 'RHCANADA_NEW-RELEASES_EMBEDDED_071818';
          break;

        case 'recipes':
          this.contentId = '2000000036';
          this.prefCode = ['21016'];
          this.prefNames.push('Cooking');
          this.headerLabel = 'Discover recipes and other cookbooks like this, author features, and more!';
          this.utagLink.newsletter_acquisition_code = 'RHCANADA_CATEGORY_EMBEDDED_071818';
          break;

        case 'categories':
          if (currentContentInfo.id) {
            this.headerLabel = 'Discover other books like this, author exclusives, and more!';
            this.contentId = currentContentInfo.id;
            this.utagLink.newsletter_acquisition_code = 'RHCANADA_CATEGORY_EMBEDDED_071818';
          }
          break;

        case 'excerpts':
        case 'book-club-resources':
          if (currentContentInfo.id) {
            this.headerLabel = 'Discover other books like this, author exclusives, and more!';
            this.contentId = currentContentInfo.id;
            this.utagLink.newsletter_acquisition_code = 'RHCANADA_CATEGORY_EMBEDDED_071818';
          } else {
            if (this.contentType === 'excerpts') {
              this.prefCode = ['21048'];
              this.prefNames.push('New Releases');
              this.headerLabel = 'Get the latest releases, plus author features, and more straight to your inbox';
              this.utagLink.newsletter_acquisition_code = 'RHCANADA_NEW-RELEASES_EMBEDDED_071818';
            } else {
              this.prefCode = ['21003'];
              this.prefNames.push('Book Club Resources');
              this.headerLabel = 'Discover your next book club pick, plus get access to reading guides and giveaways!';
              this.utagLink.newsletter_acquisition_code = 'RHCANADA_BOOK-CLUBS_EMBEDDED_071818';
            }
          }
          break;
        case 'features':
        case 'articles':
          this.prefCode = ['21050'];
          this.prefNames.push('Behind the Scenes');
          this.headerLabel = 'Get access to behind-the-scenes features and news about our books and authors';
          this.utagLink.newsletter_acquisition_code = 'RHCANADA_BEHIND-THE-SCENES_EMBEDDED_071818';
          break;

        case 'book-finder':
          this.prefCode = ['21053,111111,Gift Guide 2018'];
          this.prefNames.push('Title Promotions');
          this.utagLink.newsletter_acquisition_code = 'RHCANADA_GIFT-GUIDE-2018_EMEDDED_111518';
          break;
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setMcguid(userInfo) {
    if (this.contentId) {
      userInfo['contentId'] = this.contentId;
    }

    // signup with book/series categories preference codes
    if (
      this.contentType === 'books' ||
      this.contentType === 'series'
    ) {
      this.subscriptions.add(
        this.mwsApi
          .subscribeServiceWithCategories(
            userInfo,
            this.utagLink.newsletter_acquisition_code,
            this.contentType
          )
          .subscribe(response => {
            this.prefNames = response.prefNames;

            // set guid
            response.response['data']['Msg'].map(guid => {
              this.mcguid = guid.MasterContactGuid;
            });

            // send tealium
            this.utagLink.pid = this.mcguid;
            this.tealium.track('link', this.utagLink);
          })
      );
    // signup with a category preference code
    } else if (
      (this.contentType === 'categories' ||
      this.contentType === 'excerpts' ||
      this.contentType === 'book-club-resources') &&
      this.contentId
    ) {
      const prefCode = getPrefCodeByCatId(this.contentId);
      if (prefCode) {
        userInfo['contentId'] = this.contentId;
        this.prefNames.push(prefCode.name);
        this.subscriptions.add(
          this.mwsApi
            .subscribeService(userInfo, this.utagLink.newsletter_acquisition_code)
            .subscribe(response => {
              // set guid
              response['data']['Msg'].map(guid => {
                this.mcguid = guid.MasterContactGuid;
              });

              // send tealium
              this.utagLink.pid = this.mcguid;
              this.tealium.track('link', this.utagLink);
            })
          );
      }

      if (this.contentId !== '2000000169' && !prefCode) {
        this.subscriptions.add(
          this.enhanced
            .getCategoryParent(this.contentId)
            .subscribe(parentCatIds => {
              if (parentCatIds.length) {
                let prefCatId;
                parentCatIds.map(catId => {
                  if (!prefCatId && getPrefCodeByCatId(catId)) {
                    prefCatId = catId;
                  }
                });

                if (prefCatId) {
                  userInfo['contentId'] = prefCatId;
                  this.prefNames.push(getPrefCodeByCatId(prefCatId).name);
                }
              }

              this.mwsApi
                .subscribeService(userInfo, this.utagLink.newsletter_acquisition_code)
                .subscribe(response => {
                  response['data']['Msg'].map(guid => {
                    this.mcguid = guid.MasterContactGuid;
                  });

                  // send tealium
                  this.utagLink.pid = this.mcguid;
                  this.tealium.track('link', this.utagLink);
                });
            })
        );
      }

    // generic signup
    } else {
      if (this.prefCode) {
        userInfo['prefCode'] = this.prefCode;
      }
      this.subscriptions.add(
        this.mwsApi
          .subscribeService(userInfo, this.utagLink.newsletter_acquisition_code)
          .subscribe(response => {
            response['data']['Msg'].map(guid => {
              this.mcguid = guid.MasterContactGuid;
            });

            // send tealium
            this.utagLink.pid = this.mcguid;
            this.tealium.track('link', this.utagLink);

            // get quiz result.
            this.stepAction.emit('forward');
          })
      );
    }
  }

  step(action) {
    this.stepAction.emit(action);
  }
}
