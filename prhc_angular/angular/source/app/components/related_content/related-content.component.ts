import {
  Component,
  OnInit,
  Injectable,
  OnDestroy
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';
import { PrhcApiService } from '../../services/prhc_api.service';
import { EnhancedApiService } from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const relatedContentSelector = 'related-content';

@Component({
  selector: relatedContentSelector,
  templateUrl: './related-content.component.html',
})
@Injectable()
export class RelatedContentComponent implements OnInit, OnDestroy {
  emptyFlags = [];
  accordion = {
    id: 'related',
    heading: 'Related Content',
    toggle: false,
    chevron: 'chevron-down'
  };

  articles = [];
  links = [];
  videos = [];

  private subscriptions = new Subscriber();

  constructor (
    private prhcApi: PrhcApiService,
    private enhanced: EnhancedApiService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.prhcApi.getRelatedArticles()
      .subscribe(response => {
        this.articles = response;
      })
    );

    this.subscriptions.add(
      this.enhanced.getRelatedLinks(3000)
      .subscribe(response => {
        this.links = response;
      })
    );

    this.subscriptions.add(
      this.enhanced.getRelatedLinks(10000)
      .subscribe(response => {
        this.videos = response;
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
