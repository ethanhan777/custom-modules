import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { EnhancedApiService } from '../../services/enhanced_api.service';

export const heroArticleSelector = 'hero-article';

@Component({
  selector: heroArticleSelector,
  templateUrl: './hero-article.component.html',
})
@Injectable()
export class HeroArticleComponent implements OnInit, OnDestroy {
  authorId: string;
  isHomepage = false;
  lightbox = false;
  videoOn = false;
  @Input() article;
  @Output() isLoaded = new EventEmitter<any>();
  @Output() clicked = new EventEmitter<any>();
  private subscriptions = new Subscriber();
  private currentPath = location.pathname.split('/');
  private contentCode = this.currentPath[2];
  pageType = this.currentPath[1];
  guideTheme = 'dark';

  constructor( private prhcApi: PrhcApiService, private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    if (this.pageType === '') {
      this.pageType = undefined;
    }

    if (this.article && this.pageType === undefined) {
      if (this.article.imageUrl) {
        // for the homepage carousel
        this.subscriptions.add(
          this.prhcApi.getHomepageHeroImage(this.article.imageUrl)
            .subscribe(response => {
              if (response['data'].attributes) {
                this.article.imageUrl = response['data'].attributes.url;
              }
              this.isLoaded.emit(true);
            })
        );
      } else {
        this.isLoaded.emit(true);
      }
    } else if (this.pageType === 'node') {
      // preview mode
      const nodeId = window.location.pathname.split('/')[3];
      this.prhcApi.getPreview('article', nodeId, 'field_image').subscribe(response => {
        if (
          response.article &&
          response.article['data'] &&
          response.article['data'].length
        ) {
            this.article = response.article['data'][0].attributes;
            if (this.article.field_date_posted_flag) {
              this.article.published = this.article.field_date_posted;
            }
              // get the author name if the author byline has been added
              if (this.article.field_author) {
                this.subscriptions.add(
                  this.enhanced.getAuthor(this.article.field_author)
                  .subscribe(authorResponse => {
                    if (authorResponse && authorResponse['data'] && authorResponse['data'].length) {
                      this.article.authorName = authorResponse['data'][0].display;
                      this.article.authorUrl = authorResponse['data'][0].seoFriendlyUrl;
                    }
                  }));
              }
            this.article.type = 'article';
            if (response.article['included'] && response.article['included'].length) {
              const articleImage = response.article['included'][0];
              if (articleImage.attributes) {
                this.article.imageUrl = articleImage.attributes.url;
              }
            }
            this.isLoaded.emit(true);
          } else {
          // get content for campaign node preview
            this.prhcApi.getPreview('campaign', nodeId, 'field_image').subscribe(campaignResponse => {
              if (
                campaignResponse.article &&
                campaignResponse.article['included'] &&
                campaignResponse.article['included'].length
              ) {
                this.article = campaignResponse.article['data'][0].attributes;
                const articleImage = campaignResponse.article['included'][0];
                if (articleImage.attributes) {
                  this.article.imageUrl = articleImage.attributes.url;
                }
                this.isLoaded.emit(true);
              }
          });
        }
      });
    } else if (this.pageType === 'imprints') {
      // hero for imprints
      this.subscriptions.add(
        this.prhcApi.getImprint(this.contentCode)
          .subscribe(response => {
            if (response['data'].length) {
              response['data'].map(imprint => {
                this.article = {
                  title: imprint.attributes.title,
                  subtitle: imprint.attributes.field_subtitle,
                };
                // hero image alt text and image id
                if (imprint.relationships && imprint.relationships.field_image.data) {
                  this.article.imageAlt = imprint.relationships.field_image.data.meta.alt;
                  this.article.imageId = imprint.relationships.field_image.data.id;
                }
              });
              // hero image
              if (response['included'] && this.article.imageId) {
                response['included'].map(image => {
                  // make sure to get the right image
                  if (image.id === this.article.imageId) {
                    this.article.imageUrl = image.attributes.url;
                  }
               });
             }
           } else {
             // get API content for imprints with no custom content
             this.enhanced.getImprint(this.contentCode)
               .subscribe(apiImprint => {
                 apiImprint['data'].map(imprintContent => {
                   this.article = {
                     title: imprintContent.description,
                   };
                 });
               });
             }
        })
      );
    } else if (this.pageType === 'recipes') {
      this.subscriptions.add(
        this.prhcApi.getArticleHero()
          .subscribe(response => {
            this.article = response;
            if (this.article.relatedBooks) {
              this.enhanced.getTitle(this.article.relatedBooks[0], false)
              .subscribe(title => {
                this.article.subtitle = `Excerpted from <i>${title['data'][0].title}</i>`;
              });
            }
          })
      );
    } else {
      this.subscriptions.add(
        this.prhcApi.getArticleHero()
          .subscribe(response => {
            this.article = response;

            // get the author name if the author byline has been added
            if (this.article.authorId) {
              this.subscriptions.add(
                this.enhanced.getAuthor(this.article.authorId)
                .subscribe(authorResponse => {
                  if (authorResponse && authorResponse['data'] && authorResponse['data'].length) {
                    this.article.authorName = authorResponse['data'][0].display;
                    this.article.authorUrl = authorResponse['data'][0].seoFriendlyUrl;
                  }
                }));
            }
            if (this.article.theme) {
              this.guideTheme = 'light';
            }
          })
        );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onClick(title) {
    this.clicked.emit(title);
  }
}
