import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';

export const mlclArticleListSelector = 'mlcl-article-list';

@Component({
  selector: 'mlcl-article-list',
  templateUrl: './mlcl-article-list.component.html',
})
export class MlclArticleListComponent implements OnInit {
  @Input() articles = [];
  @Input() heading: string;
  @Input() loading = false;
  @Input() loadMoreFlag = false;
  @Input() noResultMessage: string;
  @Output() loadMore = new EventEmitter<any>();
  showSignUp = false;

  ngOnInit() {
    if (this.articles.length > 1) {
      this.showSignUp = true;
    }
  }
  /**
   * load more api data
   *
   * @param {rows}
   */
  loadMoreArticles() {
    this.loadMore.emit(true);
  }
}
