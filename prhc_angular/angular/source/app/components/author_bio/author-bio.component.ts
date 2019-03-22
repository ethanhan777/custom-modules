import {
  Component,
  OnInit,
  Injectable,
  OnDestroy
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';
import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const authorBioSelector = 'author-bio';

@Component({
  selector: authorBioSelector,
  templateUrl: './author-bio.component.html',
})
@Injectable()
export class AuthorBioComponent implements OnInit, OnDestroy {
  accordion: any;
  spotlight: string;
  private subscriptions = new Subscriber();

  constructor (private enhanced: EnhancedApiService) {}

  ngOnInit() {
    // set accordion
    this.accordion = {
      id: 'author-bio',
      heading: 'Author Bio',
      toggle: false,
      chevron: 'chevron-down',
    };

    this.subscriptions.add(
      this.enhanced
        .getAuthor(getCurrentContentInfo().id, 'content')
        .subscribe(response => {
          if (response['data'].spotlight) {
            this.spotlight = response['data'].spotlight;
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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
