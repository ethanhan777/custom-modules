import {
  Component,
  Injectable,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';

import {
  PrhcApiService,
  parseFormElements
} from '../../services/prhc_api.service';
import { setAquisitionCode } from '../../services/mws_api.service';
import { getFormattedDateSimple } from '../../services/date_format.service';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';

export const campaignCategorySelector = 'campaign-category';

@Component({
  selector: campaignCategorySelector,
  templateUrl: './campaign-category.component.html',
})
@Injectable()
export class CampaignCategoryComponent implements OnInit, OnDestroy {
  isLoaded = false;
  campaignComponents = [];
  campaignTitle: string;
  formElements = [];
  webformAttr: any;
  acquisitionCode: string;
  preferences = [];
  officialRule = {};
  webformConsent: any;
  campaignType: string;
  isListGuide = false;
  savedBookDisplayFlag = {};
  private subscriptions = new Subscriber();
  private currentContentInfo = getCurrentContentInfo();

  constructor ( private prhcApi: PrhcApiService) {}

  ngOnInit() {
    let request;

    // get content for homepage node preview
    if (this.currentContentInfo.type === 'node') {
      const nodeId = window.location.pathname.split('/')[3];
      this.prhcApi.getPreview('homepage', nodeId, 'field_category').subscribe(response => {
        if (
          response.article &&
          response.article['included'] &&
          response.article['included'].length
        ) {
          this.campaignComponents = response.article['included'];
        } else {
          // get content for campaign node preview
            this.prhcApi.getPreview('campaign', nodeId, 'field_category').subscribe(campaignResponse => {
              if (
                campaignResponse.article &&
                campaignResponse.article['included'] &&
                campaignResponse.article['included'].length
              ) {
                this.campaignComponents = campaignResponse.article['included'];
              }
          });
        }
      });
    }

    // get content for the homepage
    if (window.location.pathname === '/') {
      request = this.prhcApi.getHomepage();
      this.campaignType = 'home';
    } else {
      request = this.prhcApi.getArticle('field_category,field_campaign_categories');
    }

    this.subscriptions.add(
      request.subscribe(res => {
        if (
          res.article &&
          res.article.included &&
          res.article.included.length
        ) {
          this.campaignComponents = res.article['included'];

          // set aquisition code
          this.campaignTitle = res.article.data[0].attributes.title;
          this.acquisitionCode = setAquisitionCode(this.campaignTitle);

          // check for webforms
          res.article.included.map(paragraph => {
            if (paragraph.type === 'paragraph--webform') {
              // set form elements
              this.setWebformElements(paragraph);

              // set preferences
              if (
                paragraph.attributes.field_newsletter_prefs &&
                paragraph.attributes.field_newsletter_prefs.length
              ) {
                this.preferences = paragraph.attributes.field_newsletter_prefs;
              }

              // set official rules
              if (
                paragraph.relationships &&
                paragraph.relationships.field_official_rules
              ) {
                this.setOfficialRules(paragraph);
              }
            }
          });

        } else if (res['included'] && res['included'].length) {
          this.campaignComponents = res['included'];
        }
        this.campaignComponents.map(component => {
          if (component.type === 'taxonomy_term--campaign_categories') {
            this.campaignType = component.attributes.name;
          }
        });

        // show save button if campaign type is either list or guide
        this.isListGuide = ['List', 'Guide'].indexOf(this.campaignType) > -1;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setWebformElements(paragraph) {
    this.prhcApi
      .getWebformElements(paragraph.id)
      .subscribe(webformEl => {
        // set concent checkbox status
        if (
          paragraph.attributes.field_consent_required ||
          paragraph.attributes.field_include_consent
        ) {
          this.webformConsent = {
            consentRequired: paragraph.attributes.field_consent_required,
          };
        }

        // set acquisition code type
        if (paragraph.attributes.field_acquisition_type) {
          this.acquisitionCode +=  '_' + paragraph.attributes.field_acquisition_type;
        }

        // set acquisition code date
        if (webformEl['#webform_attr'].open) {
          this.acquisitionCode +=  '_' + getFormattedDateSimple(webformEl['#webform_attr'].open);
        } else {
          this.acquisitionCode +=  '_' + getFormattedDateSimple(paragraph.attributes.created * 1000);
        }

        this.webformAttr = webformEl['#webform_attr'];
        const elements = Object.entries(webformEl);
        this.formElements = parseFormElements(elements);
      });
  }

  setOfficialRules(paragraph) {
    this.prhcApi
      .getData(paragraph.relationships.field_official_rules.links.related)
      .subscribe(officialRuleRes => {
        if (
          officialRuleRes['data'] &&
          officialRuleRes['data'].attributes
        ) {
          this.officialRule = {
            title: officialRuleRes['data'].attributes.title,
            url: officialRuleRes['data'].attributes.path ?
              officialRuleRes['data'].attributes.path.alias :
              '/node/' + officialRuleRes['data'].attributes.nid,
          };
        }
      });
  }

  saveOnClick(resp) {
    this.savedBookDisplayFlag = resp;
  }
}
