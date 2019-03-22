import {
  Component,
  OnInit,
  OnDestroy,
  Injectable
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo,
  bannedCategories
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const categoryBookListSelector = 'category-book-list';

@Component({
  selector: categoryBookListSelector,
  templateUrl: './category-book-list.component.html',
})
@Injectable()
export class CategoryBookListComponent implements OnInit, OnDestroy {
  heading = 'All Books in ';
  sliderHeading = 'Books in ';
  works = [];
  loading = false;
  loadMoreFlag = false;
  start = 0;
  rows = 32;
  sortOptions = {};
  hasChildren = false;
  childrenCategories = [];
  currentContentInfo = getCurrentContentInfo();
  private subscriptions = new Subscriber();

  constructor (private enhanced: EnhancedApiService) {}

  ngOnInit() {
    if (this.currentContentInfo.id === '2000000125') {
      this.getCategoryWorks();
    } else {
      this.subscriptions.add(
        this.enhanced
          .getCategoryChildren(this.currentContentInfo.id)
          .subscribe(response => {
            if (response.children['data'] && response.children['data'].length) {
              response.children['data'].map(childrenCategory => {
                if (bannedCategories.indexOf(childrenCategory.catId) < 0) {
                  this.childrenCategories.push(childrenCategory);
                }
              });

              this.hasChildren = true;
            } else {
              this.getCategoryWorks();
            }

            if (response.category['data'] && response.category['data'].length) {
              this.heading += response.category['data'][0].description;
            }
          })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getCategoryWorks() {
    this.enhanced
      .getCategoryWorksList(this.currentContentInfo.id)
      .subscribe(response => {
        if (response.data && response.data.length) {
          this.works = response.data;
        }

        if (this.currentContentInfo.id === '2000000125') {
          // different heading for politics category
          const urlTitle = location.pathname.split('/')[3];
          this.heading += urlTitle.charAt(0).toUpperCase() + urlTitle.slice(1);
        }

        this.loadMoreFlag = response.recordCount > this.works.length;
      });
  }

  sort(sortOptions) {
    this.loading = true;
    this.sortOptions = sortOptions;

    this.subscriptions.add(
      this.enhanced
        .getCategoryWorksList(
          this.currentContentInfo.id,
          {
            next: 0,
            sort: this.sortOptions
          }
        )
        .subscribe(response => {
          if (response.data && response.data.length) {
            this.works = [];
            this.works = response.data;
          }

          this.loadMoreFlag = response.recordCount > this.works.length;
          this.loading = false;
        })
    );
  }

  loadMore() {
    this.start += this.rows;
    this.loading = true;

    this.subscriptions.add(
      this.enhanced
        .getCategoryWorksList(
          this.currentContentInfo.id,
          {next: this.start}
        )
        .subscribe(response => {
          if (response.data && response.data.length) {
            response.data.map(work => {
              this.works.push(work);
            });
          }

          this.loadMoreFlag = response.recordCount > this.works.length;
          this.loading = false;
        })
    );
  }
}
