import {
  Component,
  OnInit,
  OnDestroy,
  Injectable
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo,
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const imprintContentSelector = 'imprint-content';

@Component({
  selector: imprintContentSelector,
  templateUrl: './imprint-content.component.html',
})
@Injectable()
export class ImprintContentComponent implements OnInit, OnDestroy {
  data = [];
  isLoaded = false;
  loading = false;
  loadMoreFlag = false;
  heading = ' ';
  loadMoreCounter = 0;
  private currentContentInfo = getCurrentContentInfo();
  private rows = 8;
  private options = {
    imprintCode: undefined,
    subjectCode: undefined,
    showReadingGuides: false,
    hasExcerpt: false,
    sort: { name: 'onsale', dir: 'desc' },
    next: 0,
    rows: 8,
  };
  allBooksLink = location.pathname + '/books';
  hasComingSoonorNew = false;
  // private somethingStatus = [];
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
   // All books from an imprint
    this.options.imprintCode = this.currentContentInfo.id;
    const request = this.enhanced.getWorkImprint(this.options, this.currentContentInfo.type, this.rows);
    this.subscribeRequest(request);
  }

  checkStatus(status) {
    if (status === true) {
      this.hasComingSoonorNew = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  subscribeRequest(request) {
    request.subscribe(response => {
      if (response.data && response.data.length) {

        // const currentDay = new Date();
        // const newRelease = currentDay.setDate(currentDay.getDate() - 180); // 6 months in past
        // const newReleaseFormatted = new Date (newRelease).toISOString().split(('T'))[0];

        response.data.map(work => {
          this.data.push(work);
           // check for new releases and coming soon
          // this.data.map(book => {
          //   if (book.onsale > newReleaseFormatted) {
          //     this.hasComingSoonorNew = true;
          //   }
          // });
        });
      }

      this.isLoaded = this.data.length > 0;
      this.loading = false;
    });
  }

}
