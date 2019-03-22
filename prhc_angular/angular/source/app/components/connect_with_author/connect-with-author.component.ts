import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
  Input
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const connectWithAuthorSelector = 'connect-with-author';

@Component({
  selector: connectWithAuthorSelector,
  templateUrl: './connect-with-author.component.html',
})
@Injectable()
export class ConnectWithAuthorComponent implements OnInit, OnDestroy {
  @Input() author: any;
  @Input() contentType = 'authors';
  isLoaded = false;
  showSignUp = true;
  showOnImprint = true;
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService, private prhc: PrhcApiService ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();

    if (currentContentInfo.type === 'imprints') {
      this.showSignUp = false;
      this.subscriptions.add(
        this.prhc
          .getImprint(currentContentInfo.id)
          .subscribe(response => {
            if (response['data'] && response['data'].length) {
              this.author = response['data'][0];
              // using the same format for imprint title as author titles so this can be used in molecules
              this.author.display = this.author.attributes.title;

              // social links
              this.author.relatedLinks = [];

              if (this.author.attributes.field_facebook_link) {
                this.author.relatedLinks.push({ linkAttr: 17000, url: this.author.attributes.field_facebook_link });
              }
              if (this.author.attributes.field_instagram_link) {
                this.author.relatedLinks.push({ linkAttr: 23000, url: this.author.attributes.field_instagram_link });
              }
              if (this.author.attributes.field_pinterest_link) {
                this.author.relatedLinks.push({ pinterest: true, url: this.author.attributes.field_pinterest_link });
              }
              if (this.author.attributes.field_twitter_link) {
                this.author.relatedLinks.push({ linkAttr: 19000, url: this.author.attributes.field_twitter_link });
              }
              if (this.author.relatedLinks.length < 1) {
                this.showOnImprint = false;
              }
              this.isLoaded = true;
            }
          })
      );
    } else if (currentContentInfo.type === 'about') {
        this.author = {
          display: 'Penguin Random House Canada',
          relatedLinks: [
            {
              linkAttr: 17000, // Facebook
              url: 'https://www.facebook.com/PenguinRandomCA/',
            },
            {
              linkAttr: 23000, // Instagram
              url: 'https://www.instagram.com/penguinrandomca/',
            },
            {
              pinterest: true, // Pinterest
              url: 'https://www.pinterest.ca/penguinrandomca/',
            },
            {
              linkAttr: 19000, // Twitter
              url: 'https://twitter.com/PenguinRandomCA',
            },
          ],
        };
      this.isLoaded = true;
    } else if (!this.author) {
      // call authorDisplay to get author info including social links.
      this.subscriptions.add(
        this.enhanced
          .getAuthor(currentContentInfo.id, 'display')
          .subscribe(response => {
            if (response['data'] && response['data'].length) {
              this.author = response['data'][0];
              this.isLoaded = true;
            }
          })
      );
    } else if (this.author) {
      this.isLoaded = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
