import {
  Component,
  AfterViewInit,
  OnDestroy,
  Injectable,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Renderer,
  OnInit
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { EnhancedApiService } from '../../services/enhanced_api.service';

@Component({
  selector: 'mlcl-search-bar',
  templateUrl: '../../components/search_bar_global/search-bar-global.component.html',
})
@Injectable()
export class MlclSearchBarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() isLoaded = false;
  @Output() newSearchTerm = new EventEmitter<any>();
  @ViewChild('searchBar') searchBarEl: ElementRef;
  @ViewChild('predictivePane') predictiveEl: ElementRef;
  searchTerm: string;
  predictiveResults: any;
  hasSuggestions = false;
  focusPosition = 0;
  private subscriptions = new Subscriber();

  constructor(
    private enhanced: EnhancedApiService,
    private rd: Renderer
  ) {}

  ngOnInit() {
    // hide predictive results when clicking outside
    document.addEventListener('click', () => {
      this.hasSuggestions = false;
    });
  }

  ngAfterViewInit() {
    // make a focus on appearence
    this.rd.invokeElementMethod(this.searchBarEl.nativeElement, 'focus');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /*
   * redirect to search page with search keyword
   */
  search() {
    if (this.searchTerm && this.searchTerm.trim().length < 3) {
      return false;
    }
    this.newSearchTerm.emit(this.searchTerm);
    this.clear();
  }

  /**
    * by clicking arrow up and down key, select predictive suggestions on the list.
    *
    * @param {event} key down event.
    */
  predictiveSelect(event: KeyboardEvent) {
    // #predictivePane
    const predictiveSuggestions = this.predictiveEl.nativeElement.children;
    // key up
    if (event.keyCode === 38) {
      if (this.focusPosition > 0 ) {
        this.focusPosition--;
        this.rd.invokeElementMethod(predictiveSuggestions[this.focusPosition], 'focus');
      } else {
        this.rd.invokeElementMethod(this.searchBarEl.nativeElement, 'focus');
      }
    } else if (event.keyCode === 40) {
      if (this.focusPosition < predictiveSuggestions.length - 1 ) {
        this.focusPosition++;
        this.rd.invokeElementMethod(predictiveSuggestions[this.focusPosition], 'focus');
      }
    }
    return false;
  }

  /*
  * clear search term in search input box.
  */
  clear() {
    this.searchTerm = '';
    this.disablePridiction();
  }

  /*
  * trigger predictive search as user enters keyword.
  */
  predictiveSearch(event: KeyboardEvent) {
    // move focus to predictive pane
    if (this.searchTerm && this.searchTerm.trim().length > 2 &&
    event.keyCode === 40) {
      this.rd.invokeElementMethod(this.predictiveEl.nativeElement.children[0], 'focus');

      // prevent page scrolling by pressing arrow down key
      window.addEventListener('keydown', function(e) {
        // space and arrow keys
        if (e.keyCode === 40 ) {
          e.preventDefault();
        }
      }, false);
    } else {
      // disable predictive search until keyword's length is more than 2
      // or term is the same as previous.
      if (this.searchTerm && this.searchTerm.trim().length < 3) {
        // remove predictive pane when removing term from the bar
        if (this.searchTerm.trim().length === 0) {
          this.disablePridiction();
        }
        return false;
      }

      this.isLoaded = false;

      this.subscriptions.add(
        this.enhanced
        .getPredictiveResult(encodeURIComponent(this.searchTerm))
        .subscribe(response => {
          if (response['data']['results']['keyword']) {
            delete response['data']['results']['keyword'];
          }
          this.predictiveResults = response['data']['results'];
          this.hasSuggestions = true;
        })
      );
      // this.predictiveResults = response.data.results;
      //     this.hasSuggestions = true;
    }
  }

  /*
  * remove predictive result panel
  */
  disablePridiction() {
    this.predictiveResults = [];
    this.hasSuggestions = false;
  }
}
