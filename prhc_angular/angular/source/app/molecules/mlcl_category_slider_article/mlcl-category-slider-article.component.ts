import {
  Component,
  OnInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';

@Component({
  selector: 'mlcl-category-slider-article',
  templateUrl: './mlcl-category-slider-article.component.html',
})
export class MlclCategorySliderArticleComponent implements OnInit, OnDestroy {
  @Input() category: any;
  @Input() nodeInfo = {};

  viewAllFlag = false;
  viewAllUrl: string;
  articles = [];
  isLoaded = false;
  heading = 'More ';
  headingTag = {};
  private subscriptions = new Subscriber();

  constructor( private prhcApi: PrhcApiService ) {}

  ngOnInit() {
    // set block title
    const categoryUrl = this.category.path
      ? this.category.path.alias
      : '/taxonomy/term/' + this.category.tid;

    if (this.nodeInfo['type'] === 'recipe') {
      this.heading += 'recipes in ';
    }

    this.headingTag = {
      name: this.category.name,
      seoFriendlyUrl: categoryUrl,
    };

    this.viewAllUrl = categoryUrl;

    this.subscriptions.add(
      this.prhcApi
        .getArticlesInCategory(
          this.nodeInfo['type'],
          this.nodeInfo['id'],
          this.category.tid,
          this.category.categoryFieldName
        )
        .subscribe (response => {
          if (response && response.length) {
            this.articles = response;
            this.isLoaded = true;
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
