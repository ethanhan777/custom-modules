import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';
import { PrhcApiService } from '../../services/prhc_api.service';

export const nodeArticlePageSelector = 'node-article-page';

@Component({
  selector: nodeArticlePageSelector,
  templateUrl: './node-article-page.component.html',
})
@Injectable()
export class NodeArticlePageComponent implements OnInit, OnDestroy {
  article: any;
  private subscriptions = new Subscriber();

  constructor(
    private prhcApi: PrhcApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.prhcApi.getArticle('field_global_category')
        .subscribe(response => {
          if (response.article['data'] && response.article['data'].length) {
            this.article = response.article;
            this.sendTealiumData(this.article);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendTealiumData(article) {
    const utagData = {
      'page_type': 'article',
      'page_name': article['data'][0].attributes.title,
    };

    if (article.included) {
      article.included.map(include => {
        if (include.type === 'taxonomy_term--global_categories') {
          utagData['category_type'] = include.attributes.name;
        }
      });
    }

    this.tealium.track('view', utagData);
  }
}
