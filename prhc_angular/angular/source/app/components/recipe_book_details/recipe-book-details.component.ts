import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';
import { PrhcApiService } from '../../services/prhc_api.service';

export const recipeBookDetailsSelector = 'recipe-book-details';

@Component({
  selector: recipeBookDetailsSelector,
  templateUrl: './recipe-book-details.component.html',
})
@Injectable()
export class RecipeBookDetailsComponent implements OnInit {
  relatedBookIds: string;
  relatedRechipeHeading = 'More recipes from ';
  copyright: string;
  accordion: any;
  currentContentId: number;

  constructor (private prhcApi: PrhcApiService) {}

  ngOnInit() {
    this.accordion = {
      id: 'book-details',
      heading: 'Book Details',
      toggle: false,
      chevron: 'chevron-down',
    };

    this.prhcApi.getArticle()
      .subscribe(response => {
        this.currentContentId = response.nodeInfo['data'].id;
        if (response.article['data'] && response.article['data'].length) {
          response.article['data'].map(node => {
            if (node.attributes.field_related_books) {
              this.relatedBookIds = node.attributes.field_related_books[0];
            }

            if (node.attributes.field_copyright) {
              this.copyright = node.attributes.field_copyright.value;
            }
          });
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

  setBookTitle($event) {
    this.relatedRechipeHeading += $event;
  }
}
