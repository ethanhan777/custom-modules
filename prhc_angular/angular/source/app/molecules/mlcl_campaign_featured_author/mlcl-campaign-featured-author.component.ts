import {
  Component,
  Injectable,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { EnhancedApiService } from '../../services/enhanced_api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

@Component({
  selector: 'mlcl-campaign-featured-author',
  templateUrl: './mlcl-campaign-featured-author.component.html',
})
@Injectable()
export class MlclCampaignFeaturedAuthorComponent implements OnInit, OnDestroy {
  @Input() featuredAuthor;
  customHeading: string;
  customDescription: any;
  author: any;
  buttons = [];
  private subscriptions = new Subscriber();

  constructor (
    private enhanced: EnhancedApiService,
    private _sanitizer: DomSanitizer,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    if (this.featuredAuthor && this.featuredAuthor.attributes.field_author) {
      const authorId = this.featuredAuthor.attributes.field_author;
      this.customHeading = this.featuredAuthor.attributes.field_subheading;
      if (this.featuredAuthor.attributes.field_custom_description) {
        const customDesc = this.featuredAuthor.attributes
          .field_custom_description.value;
        this.customDescription = this._sanitizer.bypassSecurityTrustHtml(
          customDesc,
        );
      }

      this.subscriptions.add(
        this.enhanced
          .getAuthor(authorId)
          .subscribe(response => {
            if (response['data'] && response['data'].length) {
              this.author = response['data'][0];

              this.buttons.push({
                label: 'Read More',
                seoFriendlyUrl: this.author.seoFriendlyUrl,
              });

              if (this.featuredAuthor.attributes.field_link) {
                const authorLinkUrl = this.featuredAuthor.attributes.field_link.uri;
                let authorLinkLabel = this.featuredAuthor.attributes.field_link.uri;
                if (this.featuredAuthor.attributes.field_link.title) {
                  authorLinkLabel = this.featuredAuthor.attributes.field_link.title;
                }

                this.buttons.push({
                  label: authorLinkLabel,
                  seoFriendlyUrl: authorLinkUrl,
                });
              }
            }
          })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onClick(buttonLable?) {
    if (!buttonLable || buttonLable === 'Read More') {
      this.tealium.track('link', {
        'module_type': 'Campaign Feature',
        'module_variation': this.author.display,
      });
    }
  }
}
