import {
  Component,
  OnInit,
  OnDestroy,
  Injectable,
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { EnhancedApiService, getCurrentContentInfo } from '../../services/enhanced_api.service';

export const authorsGridSelector = 'authors-grid';

@Component({
  selector: authorsGridSelector,
  templateUrl: './authors-grid.component.html',
})
@Injectable()
export class AuthorsGridComponent implements OnInit, OnDestroy {
  data = [];
  isLoaded = false;
  loading = false;
  loadMoreFlag = false;
  scrollPoint = 'cmpnt_authors-grid';
  authorLastInitial = 'A';
  currentContentInfo = getCurrentContentInfo();
  noResults = false;
  private rows = 32;
  private options = {
    lastName: this.authorLastInitial,
    sort: { name: 'authorLast', dir: 'asc' },
    next: 0,
  };
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    // set filters for child component
    this.loadAuthors();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadMore() {
    this.loadMoreFlag = false;
    this.loading = true;
    this.options.next = this.options.next + this.rows;
    this.loadAuthors();
  }

  subscribeRequest(request) {
    this.subscriptions.add(
      request.subscribe(response => {
        if (response === false) {
          this.noResults = true;
        }

        if (response.data && response.data.length) {
          response.data.map(work => {
            this.data.push(work);
            this.noResults = false;
          });
          if (response.recordCount > this.data.length) {
            this.loadMoreFlag = true;
          }
        }

        this.isLoaded = this.data.length > 0;
        this.loading = false;
      })
    );
  }

  /**
   * when alaphbet pagination is clicked, update authroLastInitial filter
   * so authro grid molecule component can reload the list of authors.
   */
  updatePagination(selectedAuthorLastInitial) {
    this.loading = true;
    this.data = [];
    this.authorLastInitial = selectedAuthorLastInitial;
    this.options.lastName = this.authorLastInitial;
    this.options.sort = { name: 'authorLast', dir: 'asc' };
    this.options.next = 0;
    this.loadAuthors();
  }

  loadAuthors() {
    this.loadMoreFlag = false;

    const request = this.enhanced.getAuthors(
      this.currentContentInfo.type,
      this.options
    );
    this.subscribeRequest(request);
  }
}
