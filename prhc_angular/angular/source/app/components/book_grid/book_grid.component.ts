import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import { EnhancedApiService, getCurrentContentInfo, } from '../../services/enhanced_api.service';

export const bookGridSelector = 'book-grid';

@Component({
  selector: bookGridSelector,
  templateUrl: './book_grid.component.html',
})
@Injectable()
export class BookGridComponent implements OnInit {
  data = [];
  isLoaded = false;
  loading = false;
  loadMoreFlag = false;
  heading = ' ';
  loadMoreCounter = 0;
  private currentContentInfo = getCurrentContentInfo();
  private rows = 32;
  private options = {
    imprintCode: undefined,
    subjectCode: undefined,
    showReadingGuides: false,
    hasExcerpt: false,
    sort: { name: 'onsale', dir: 'desc' },
    next: 0,
  };

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    // set the default sort order on load if different from desc
    if (this.currentContentInfo.type === 'coming-soon') {
      this.options.sort.dir = 'asc';
    }

    // get the books
    this.getBooks();
  }

  // used to get the initial load, and then again on sort or load more
  getBooks() {
    // set filters for child component on comnig soon page
    if (this.currentContentInfo.type === 'coming-soon') {
      this.heading = 'Available Next Month';
      const request = this.enhanced.getComingSoon('next-month', this.options);
      this.subscribeRequest(request);

    } else if (this.currentContentInfo.type === 'imprints') {
      // All books from an imprint
      this.options.imprintCode = this.currentContentInfo.id;
      const request = this.enhanced.getWorkImprint(this.options, this.currentContentInfo.type);
      this.subscribeRequest(request);
    } else if (this.currentContentInfo.type === 'book-club-resources') {
      // All books within a category for reading guides
      this.options.showReadingGuides = true;
      this.options.subjectCode = this.currentContentInfo.id;
      const request = this.enhanced.getWorkImprint(this.options, this.currentContentInfo.type);
      this.subscribeRequest(request);
    } else if (this.currentContentInfo.type === 'excerpts') {
      // All books within a category for excerpts
      this.options.hasExcerpt = true;
      this.options.subjectCode = this.currentContentInfo.id;
      const request = this.enhanced.getWorkImprint(this.options, this.currentContentInfo.type);
      this.subscribeRequest(request);
    }

  }

  sort(sortOption) {
    this.loading = true;
    this.data = [];
    this.options.sort = sortOption;
    this.options.next = 0;
    this.getBooks();
  }

  loadMore() {
    this.loadMoreCounter++;
    this.loadMoreFlag = false;
    this.loading = true;
    this.options.next = this.options.next + this.rows;
    this.getBooks();
  }

  subscribeRequest(request) {
    request.subscribe(response => {
      if (response.data && response.data.length) {
        response.data.map(work => {
          this.data.push(work);
        });

        if (response.recordCount > this.data.length) {
          this.loadMoreFlag = true;
        }
      }

      this.isLoaded = this.data.length > 0;
      this.loading = false;
    });
  }
}
