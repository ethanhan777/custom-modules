import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import {
  PrhcApiService,
  parseArticleByCategory
} from '../../services/prhc_api.service';

export const articleListSelector = 'article-list';

@Component({
  selector: articleListSelector,
  templateUrl: './article-list.component.html',
})
@Injectable()
export class ArticleListComponent implements OnInit {
  articles = [];
  start = 0;
  rows = 32;
  loading = false;
  isLoaded = false;
  loadMoreFlag = false;
  noContent = false;

  constructor( private prhcApi: PrhcApiService ) {}

  ngOnInit() {
    this.prhcApi
      // .getArticles({rows: this.rows})
      .getArticlesByCategory({rows: this.rows})
      .map(parseArticleByCategory)
      .subscribe(response => {
        if (!response.articles.length) {
          this.noContent = true;
          this.isLoaded = true;
        } else {
          this.articles = response.articles;
          this.loadMoreFlag = response.loadMoreFlag;
          this.isLoaded = true;
        }
      });
  }

  /**
   * load more api data
   *
   * @param {rows}
   */
  loadMore() {
    this.loading = true;
    this.start += this.rows;

    this.prhcApi.getArticlesByCategory({
      next: this.start,
      rows: this.rows,
    })
      .map(parseArticleByCategory)
      .subscribe(response => {
        response.articles.map(article => {
          this.articles.push(article);
        });
        this.loadMoreFlag = response.loadMoreFlag;
        this.loading = false;
      });
  }
}
