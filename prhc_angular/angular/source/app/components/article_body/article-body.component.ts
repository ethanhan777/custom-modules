import {
  Component,
  OnInit,
  Injectable,
  OnDestroy
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const articleBodySelector = 'article-body';

@Component({
  selector: articleBodySelector,
  templateUrl: './article-body.component.html',
})
@Injectable()
export class ArticleBodyComponent implements OnInit, OnDestroy {
  articleBody: string;
  private subscriptions = new Subscriber();

  constructor( private prhcApi: PrhcApiService ) {}

  ngOnInit() {
    const currentUrl = window.location.pathname;
    const type = currentUrl.split('/')[1];
    const  imprintCode = currentUrl.split('/')[2];

    if (type === 'node') {
      this.subscriptions.add(
      this.prhcApi.getPreview('article', currentUrl.split('/')[3])
      .subscribe(response => {
        if (response.article['data'] && response.article['data'].length) {
          this.articleBody = response.article['data'][0].attributes.body.processed;
        }
      })
    );
    } else if (type === 'imprints') {
      this.subscriptions.add(
      this.prhcApi.getImprint(imprintCode)
      .subscribe(response => {
        response['data'].map(currentImprint => {
          this.articleBody = currentImprint.attributes.field_body.processed;
        });
      })
    );
    } else {
        this.subscriptions.add(
        this.prhcApi.getArticleHero()
          .subscribe(response => {
            if (response['body']) {
              this.articleBody = response['body'];
            }
          })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
