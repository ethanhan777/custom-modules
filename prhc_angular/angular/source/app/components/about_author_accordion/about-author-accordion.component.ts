import {
  Component,
  OnInit,
  Input,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { EnhancedApiService, getCurrentContentInfo } from '../../services/enhanced_api.service';
import { accordionOpen } from '../../services/accordion.service';
import { Subscriber } from 'rxjs/Subscriber';

export const aboutAuthorAccordionSelector = 'about-author-accordion';

@Component({
  selector: aboutAuthorAccordionSelector,
  templateUrl: './about-author-accordion.component.html',
})
@Injectable()
export class AboutAuthorAccordionComponent implements OnInit, OnDestroy {
  @Input() isbn: string;
  @Input() type: string;
  links = [];
  heading: string;
  authors = [];
  isLoaded = false;
  authorWorks;
  viewAllWorks = false;
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();
    this.subscriptions.add(
      this.enhanced
        .getAboutAuthor(
          currentContentInfo.type,
          currentContentInfo.isbn ? currentContentInfo.isbn : currentContentInfo.id
        )
        .subscribe(response => {
          this.authors = response.data;
          this.authors.map(author => {
            // if more than 15 works, cut the list and add view all link
            if (author.works.length >= 15) {
              this.authorWorks = author.works.slice(0, 14);
              this.viewAllWorks = true;
            } else {
              this.authorWorks = author.works;
            }
          });
          this.isLoaded = true;
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  hasAuthorPhoto(flag, author) {
    if (!flag && !author.spotlight) {
      this.isLoaded = false;
    }
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
