import {
  Component,
  OnInit,
  Input,
  Injectable,
} from '@angular/core';
// import { Subscriber } from 'rxjs/Subscriber';
import { PrhcApiService } from '../../services/prhc_api.service';
import { accordionOpen } from '../../services/accordion.service';

export const aboutBookAccordionArticleSelector = 'about-book-accordion-article';

@Component({
  selector: aboutBookAccordionArticleSelector,
  templateUrl: './about-book-accordion-article.component.html',
})
@Injectable()
export class AboutBookAccordionArticleComponent implements OnInit {
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

  constructor( private prhcApi: PrhcApiService ) {}

  ngOnInit() {
    this.prhcApi.getAboutAuthors('titles')
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
