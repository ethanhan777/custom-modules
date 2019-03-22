import {
  Component,
  Injectable,
  OnInit
} from '@angular/core';
import { EnhancedApiService } from '../../services/enhanced_api.service';

export const eventListByAuthorSelector = 'event-list-by-author';

@Component({
  selector: eventListByAuthorSelector,
  templateUrl: './event-list-by-author.component.html',
})
@Injectable()
export class EventListByAuthorComponent implements OnInit {
  start = 0;
  rows = 10;
  loadMoreFlag = false;
  loading = false;
  isLoaded = false;
  events = [];

  constructor( private enhanced: EnhancedApiService) {}

  ngOnInit() {
    const request = this.enhanced.getAuthorAllEvents(this.start, this.rows);
    this.subscribeRequest(request);
  }

  loadMoreEvents() {
    this.loadMoreFlag = false;
    this.loading = true;
    this.start = this.start + this.rows;

    const request = this.enhanced.getAuthorAllEvents(this.start, this.rows);
    this.subscribeRequest(request);
  }

  subscribeRequest(request) {
    request.subscribe(response => {
      if (response.data && response.data.length) {
        response.data.map(event => {
          this.events.push(event);
        });
        this.isLoaded = true;
        this.loading = false;
        this.loadMoreFlag = response.recordCount > this.events.length;
      }
    });
  }
}
