import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

export const eventPageSelector = 'event-page';

@Component({
  selector: eventPageSelector,
  templateUrl: './event-page.component.html',
})
@Injectable()
export class EventPageComponent implements OnInit, OnDestroy {
  event: any;
  private subscriptions = new Subscriber();

  constructor(
    private enhanced: EnhancedApiService,
    private tealium: TealiumUtagService
  ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();

    this.subscriptions.add(
      this.enhanced
        .getEvent(
          currentContentInfo.id,
          {'zoom': 'https://api.penguinrandomhouse.com/title/titles/definition,https://api.penguinrandomhouse.com/title/authors/definition'}
        )
        .subscribe(response => {
          if (response['data'] && response['data'].length) {
            this.event = response['data'][0];

            this.sendTealiumData(this.event);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendTealiumData(event) {
    const utagData = {
      'page_type': 'events',
      'page_name': event.location.replace(/\s+/g, ' '),
      'product_author': '',
      'product_author_ID': '',
      'product_format': '',
      'product_imprint': '',
      'product_isbn': '',
      'product_title': '',
      'product_work_id': '',
    };

    if (event.authors && event.authors.length > 0) {
      utagData.product_author = event.authors[0].display;
      utagData.product_author_ID = event.authors[0].authorId;
      utagData.page_name = event.authors[0].display + ' at ' + utagData.page_name;
    }

    if (event.titles && event.titles.length > 0) {
      utagData.product_format = event.titles[0].format.description;
      utagData.product_imprint = event.titles[0].imprint.description;
      utagData.product_isbn = event.titles[0].isbn;
      utagData.product_title = event.titles[0].title;
      utagData.product_work_id = event.titles[0].workId;
    }

    this.tealium.track('view', utagData);
  }
}
