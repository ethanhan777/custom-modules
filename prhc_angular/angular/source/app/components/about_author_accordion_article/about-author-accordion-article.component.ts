import {
  Component,
  OnInit,
  Input,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';
import { Subscriber } from 'rxjs/Subscriber';
import { PrhcApiService } from '../../services/prhc_api.service';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';

export const aboutAuthorAccordionArticleSelector = 'about-author-accordion-article';

@Component({
  selector: aboutAuthorAccordionArticleSelector,
  templateUrl: './about-author-accordion-article.component.html',
})
@Injectable()
export class AboutAuthorAccordionArticleComponent implements OnInit, OnDestroy {
  @Input() isbn: string;
  @Input() type: string;
  links = [];
  heading: string;
  authors = [];
  isLoaded = false;
  authorWorks;
  viewAllWorks = false;
  private subscriptions = new Subscriber();
  private currentContentInfo = getCurrentContentInfo();
  constructor( private prhcApi: PrhcApiService ) {}

  ngOnInit() {
    if (this.currentContentInfo.type === 'recipes') {
      this.subscriptions.add(
        this.prhcApi
        .getRecipeAboutAuthor()
        .subscribe(response => {
          if (response) {
          this.authors = response.data;
          this.setAuthorWorks(this.authors);
          this.isLoaded = true;
          }
        })
      );
    } else {
      this.subscriptions.add(
        this.prhcApi
        .getAboutAuthors('authors')
        .subscribe(response => {
          if (response) {
          this.authors = response.data;
          this.setAuthorWorks(this.authors);
          this.isLoaded = true;
          }
        })
      );
    }
  }

  setAuthorWorks(authors) {
    authors.map(author => {
      // if more than 15 works, cut the list and add view all link
      if (author.works.length >= 15) {
        this.authorWorks = author.works.slice(0, 14);
        this.viewAllWorks = true;
      } else {
        this.authorWorks = author.works;
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setMoreByAuthorHeading(author) {
    // set slider heading
    let heading = 'More ';
    // add preset if Illustrator
    if (author.roleCode && author.roleCode === 'I') {
      heading += 'Illustrated ';
    }
    heading += 'by ';
    const headingTag = {
      name: author.display,
      seoFriendlyUrl: author.seoFriendlyUrl,
    };

    return {
      heading: heading,
      headingTag: headingTag,
    };
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
}
