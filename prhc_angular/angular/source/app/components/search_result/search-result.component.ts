import {
  Component,
  OnInit,
  HostListener,
  Injectable,
  OnDestroy
} from '@angular/core';
import {
  EnhancedApiService,
  getSearchTerm,
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

export const searchResultSelector = 'search-result';

@Component({
  selector: searchResultSelector,
  templateUrl: './search-result.component.html',
})
@Injectable()
export class SearchResultComponent implements OnInit, OnDestroy {
  results: any[] = [];
  params: any;
  filters: any;
  suggestions: any;
  suggestionsCount: number;
  facets: any[] = [];
  docTypes: any;
  dateFacets: any[] = [];
  currentFacets: any = {};
  searchTerm;
  isLoaded = false;
  recordCount = 0;
  currentStart = 0;
  rows = 24;
  navOpen = false;
  navWidth = 0;
  navLabel = 'Show more filters';
  screenWidth: number;
  pageNotFound = false;
  private subscriptions = new Subscriber();

  constructor(
    private enhanced: EnhancedApiService,
    private tealium: TealiumUtagService,
  ) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    // Check if its a 404 page
    if (window.location.href.indexOf('404') > -1) {
      this.pageNotFound = true;
    }

    const currentSearchTerm = getSearchTerm();
    this.searchTerm = currentSearchTerm.searchTerm;

    this.tealium.track('view', {
      'page_type': 'Search Results Page',
      'page_name': 'Search: ' + this.searchTerm,
    });

    this.filters = currentSearchTerm.filters;
    this.setFilters(currentSearchTerm.filters, currentSearchTerm.pageNumber);
    this.search(this.searchTerm);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = event.target.innerWidth;
  }

  search(searchTerm, resetFilterFlag?) {
    // trigger tealium page view event for result with new search term.
    if (this.searchTerm !== searchTerm) {
      this.tealium.track('view', {
        'page_type': 'Search Results Page',
        'page_name': 'Search: ' + searchTerm,
      });
    }

    this.searchTerm = searchTerm;
    if (resetFilterFlag) {
      this.filters = [];
      this.currentFacets = [];
    }

    if (searchTerm) {
      this.filters['q'] = searchTerm;
    }
    this.filters['docTypeExclude'] = 'keyword';
    this.filters['preferLanguage'] = 'E';
    this.filters['rows'] = '24';
    this.filters['returnEmptyLists'] = 'true';

    // get search result data
    let start = 0;
    if (this.filters['start'] && this.filters['start'] > 0) {
      start = this.filters['start'];
    }
    this.getPaginatedData(start);
  }

  /*
   * redirect to search page with search keyword
   */
  suggestedSearch(currentTerm, suggestedTerm) {
    if (this.searchTerm && currentTerm && suggestedTerm) {
      this.searchTerm = this.searchTerm.replace(currentTerm, suggestedTerm);
    }

    this.search(this.searchTerm, true);
  }

  setFacet(selectedFacet, Toggleflag?) {
    if (
      Toggleflag &&
      this.screenWidth &&
      this.screenWidth <= 1024
    ) {
      // clase navigation
      this.mainNavToggle();
    }

    this.setFilters(selectedFacet);

    // get search result data
    this.getPaginatedData(0);
  }

  setFilters(selectedFacet, pageNumber?) {
    // tslint:disable-next-line:forin
    for (const key in selectedFacet) {
      const value = selectedFacet[key];

      if (this.filters[key]) {
        if (this.filters[key] !== value) {
          const mergedValue = this.filters[key] + ',' + value;
          this.filters[key] = mergedValue;
        }
      } else {
        this.filters[key] = value;
      }

      if (key !== 'q') {
        this.currentFacets[key] = value;
      }
    }

    if (pageNumber && pageNumber > 1) {
      this.filters['start'] = (pageNumber - 1) * this.rows;
    }
  }

  removeFacet(facet) {
    delete this.filters[facet];
    delete this.currentFacets[facet];

    // get search result data
    this.getPaginatedData(0);
  }

  getPaginatedData(start) {
    this.currentStart = start;
    this.filters['start'] = this.currentStart;

    let pageNumber;
    if (start >= this.rows) {
      pageNumber = (start / this.rows) + 1;
    }

    // get search result data
    this.getData(pageNumber);
  }

  getData(pageNumber?) {
    this.results = [];
    this.isLoaded = false;

    const urlQueries = [];
    // tslint:disable-next-line:forin
    for (const filter in this.filters) {
      const exclude = ['returnEmptyLists', 'docTypeExclude', 'preferLanguage', 'rows', 'start'];
      if (exclude.indexOf(filter) < 0) {
        urlQueries.push(filter + '=' + encodeURIComponent(this.filters[filter]));
      }
    }

    if (pageNumber) {
      urlQueries.push('page=' + pageNumber);
    }

    const pageUrl = '/search?' + urlQueries.join('&');
    window.history.pushState('', '', pageUrl);


    this.subscriptions.add(
      this.enhanced
        .getSearchResult(this.filters)
        .subscribe(response => {
          this.results = response.results;
          this.params = response.facets['params'];
          this.suggestions = response.suggestions;
          this.suggestionsCount = response.suggestionsCount;
          this.facets = response.facets['facets'];
          this.docTypes = response.facets['docTypes'];
          this.dateFacets = response.facets['dateFacets'];
          this.recordCount = response.recordCount;
          this.isLoaded = true;
        })
    );
  }

  /**
   * Toggle the navigation
   */
  mainNavToggle() {
    // Get the width of the nav
    this.navWidth = document.getElementsByClassName('cmpnt_filter-nav')[0]['offsetWidth'];
    this.navOpen = !this.navOpen;
    const bodyEl = document.getElementsByTagName('body')[0];
    if (this.navOpen) {
      this.navLabel = 'Close';
      // Push the body of the page to the left the same amount as the width of the nav
      bodyEl.style.marginLeft = this.navWidth + 'px';
      bodyEl.classList.add('nav-open');
      // close by clicking outside of nav
      document.addEventListener('click', () => {
        this.navOpen = false;
        this.navLabel = 'Show more filters';
        bodyEl.style.marginLeft = 0 + 'px';
        bodyEl.classList.remove('nav-open');
      });
    } else {
      this.navLabel = 'Show more filters';
      bodyEl.style.marginLeft = 0 + 'px';
      bodyEl.classList.remove('nav-open');
    }
  }

  keepNavOpen(event) {
    event.stopPropagation();
  }

}
