import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const moreInCategoryArticleSelector = 'more-in-category-article';

@Component({
  selector: moreInCategoryArticleSelector,
  templateUrl: './more-in-category-article.component.html',
})
export class MoreInCategoryArticleComponent implements OnInit, OnDestroy {
  categories = [];
  nodeInfo = {};
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor (private prhcApi: PrhcApiService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.prhcApi.getMoreInCategories()
        .subscribe (response => {
          if (response.categories.length) {
            this.nodeInfo = response.nodeInfo;
            this.categories = response.categories;
            this.isLoaded = true;
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
