import {
  Component,
  OnInit,
  Input,
  Injectable,
} from '@angular/core';
// import { Subscriber } from 'rxjs/Subscriber';
import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';
import { PrhcApiService, getRecipeIntro } from '../../services/prhc_api.service';
import { accordionOpen } from '../../services/accordion.service';

export const aboutBookAccordionSelector = 'about-book-accordion';

@Component({
  selector: aboutBookAccordionSelector,
  templateUrl: './about-book-accordion.component.html',
})
@Injectable()
export class AboutBookAccordionComponent implements OnInit {
  @Input() isbn: string;
  @Input() type: string;
  links = [];
  hero: any;
  bookContent = [];
  isDesc = true;
  hasCover = false;
  accordion: any;
  isLoaded = false;
  readMoreLink: any;
  lightboxOn = false;
  // private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService, private prhcApi: PrhcApiService ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();
    switch (currentContentInfo.type) {
      case 'events':
        this.enhanced
        .getEventWorks(currentContentInfo.id)
        .subscribe(response => {
          response['data'].map(title => {
            this.hero = {
              accordion: {
                id: 'about-book',
                heading: `About <i>${title.title}</i>`,
                toggle: true,
                chevron: 'chevron-up',
              },
              links: [{
                url: title.seoFriendlyUrl,
                linkText: 'Read More'
              }],
              title: title.title,
              subtitle: title.subtitle,
              image: title.cover,
              hasCover: title.frontlistiestTitle.hasCoverImage,
              series: title.series,
              contributors: undefined,
              desc: title.frontlistiestTitle.aboutTheBook,
              onSaleDate: undefined,
              isbn: title.frontlistiestTitle.isbn.toString(),
              work: title.workId,
            };
            if (!title.onSaleDate) {
              this.hero.onSaleDate = title.frontlistiestTitle.onSaleDate;
            } else {
              this.hero.onSaleDate = title.onSaleDate;
            }
            this.bookContent.push(this.hero);
            this.isLoaded = true;
          });
        });
        break;

      case 'recipes':
       this.prhcApi.getArticle('field_recipe_categories,field_units')
      .map(response => getRecipeIntro(response.article))
      .subscribe(response => {
        this.enhanced
        .getTitle(response['relatedBook'], 'display')
        .subscribe(item => {
          if (item['data'] && item['data'].length) {
            item['data'].map(content => {
              this.hero = {
                accordion: {
                  id: 'about-book-' + content.title,
                  heading: `About <i>${content.title}</i>`,
                  toggle: false,
                  chevron: 'chevron-down',
                },
                links: [{
                  url: content.seoFriendlyUrl,
                  linkText: 'Read More'
                }],
                title: content.title,
                subtitle: content.subtitle,
                hasCover: content.hasCoverImage,
                image: content.cover,
                series: content.series,
                contributors: [content.author],
                desc: content.aboutTheBook,
                onSaleDate: content.onSaleDate,
                isbn: content.isbn.toString(),
                work: content.workId,
                imprint: { name: content.imprint.description },
                format: { name: content.format.description },
                categories: content.categories,
              };

              this.bookContent.push(this.hero);
              this.isLoaded = true;
            });
          }
        });
      });
      break;

      case 'features':
      case 'articles':
      this.prhcApi.getAboutAuthors('titles')
        // .map(getContributorsOfTitle)
        .subscribe(response => {
          if (response && response['data'] && response['data'].length) {
            response['data'].map(content => {
              this.hero = {
                accordion: {
                  id: 'about-book-' + content.title ,
                  heading: `About <i>${content.title}</i>`,
                  toggle: false,
                  chevron: 'chevron-down',
                },
                links: [{
                  url: content.seoFriendlyUrl,
                  linkText: 'Read More'
                }],
                title: content.title,
                subtitle: content.subtitle,
                hasCover: undefined,
                image: content.cover,
                series: content.series,
                contributors: [content.author],
                desc: undefined,
                onSaleDate: {
                  date: content.onsale
                },
                categories: content.subjects,
                isbn: content.isbn.toString(),
                work: content.workId,
                imprint: { name: content.imprint.description },
                format: { name: content.format.description },
              };
              if (this.hero.image) {
                this.hero.hasCover = true;
              }
              if (content._embeds && content._embeds.length) {
                content._embeds.map(embed => {
                  this.hero.desc = embed.content.flapcopy;
                });
              }
              this.bookContent.push(this.hero);
            });
              this.isLoaded = true;
          }
        });
      break;

      default:
        this.enhanced
        .getTitle(currentContentInfo.isbn, 'display')
        .subscribe(response => {
          if (response['data'] && response['data'].length) {
            response['data'].map(content => {
              this.hero = {
                accordion: {
                  id: 'about-book',
                  heading: `About <i>${content.title}</i>`,
                  toggle: false,
                  chevron: 'chevron-down',
                },
                links: [{
                  url: content.seoFriendlyUrl,
                  linkText: 'Read More'
                }],
                title: content.title,
                subtitle: content.subtitle,
                hasCover: content.hasCoverImage,
                image: content.cover,
                series: content.series,
                contributors: [content.author],
                desc: content.aboutTheBook,
                onSaleDate: content.onSaleDate,
                isbn: content.isbn.toString(),
                work: content.workId,
                imprint: { name: content.imprint.description },
                format: { name: content.format.description },
                categories: content.categories,
              };
              this.bookContent.push(this.hero);
              this.isLoaded = true;
            });
          }
        });
        break;
    }
  }

  /**
   * Toggle the accordion on click
   *
   * @param {$event} accordion header click event.
   * @param {accordion} Accordion interface object.
   */
  accordionOpen(accordion) {
    accordionOpen(accordion);
  }

  lightboxEvent(clicked) {
    this.lightboxOn = clicked;
    document.getElementsByTagName('body')[0].classList.add('cmpnt_lightbox-open');
  }

  lightboxOff(clickedValue) {
    this.lightboxOn = clickedValue;
    document.getElementsByTagName('body')[0].classList.remove('cmpnt_lightbox-open');
  }
}
