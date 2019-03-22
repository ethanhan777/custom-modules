import {
  Component,
  OnInit,
  Injectable,
  OnDestroy
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const aboutBookArticleSelector = 'about-book-article';

@Component({
  selector: aboutBookArticleSelector,
  templateUrl: './about-book-article.component.html',
})
@Injectable()
export class AboutBookArticleComponent implements OnInit, OnDestroy {
  titles = [];
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor( private prhcApi: PrhcApiService ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.prhcApi.getAboutAuthors('titles')
        // .map(getContributorsOfTitle)
        .subscribe(response => {
          if (response && response['data'] && response['data'].length) {
            this.titles = response['data'];
            this.isLoaded = true;
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // getArticle(currInfo) {
  //   const url = '/jsonapi/node/article';

  //   this.enhanced.setFilter('_format', 'api_json');
  //   this.enhanced.setFilter('filter[nidFilter][condition][path]', 'nid');
  //   this.enhanced.setFilter('filter[nidFilter][condition][value]', currInfo.id);

  //   const request = this.enhanced.request(url);

  //   getResponse(request, response => {
  //     if (response.data && response.data.length) {
  //       response.data.map(article => {
  //         if (article.attributes.field_related_authors) {
  //           this.ids = article.attributes.field_related_books;
  //           this.isLoaded = true;
  //         }
  //       });
  //     }
  //   });
  // }
}
