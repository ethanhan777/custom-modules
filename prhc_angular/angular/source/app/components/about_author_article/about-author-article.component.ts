import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const aboutAuthorArticleSelector = 'about-author-article';

@Component({
  selector: aboutAuthorArticleSelector,
  templateUrl: './about-author-article.component.html',
})
@Injectable()
export class AboutAuthorArticleComponent implements OnInit, OnDestroy {
  authors = [];
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor( private prhcApi: PrhcApiService ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.prhcApi.getAboutAuthors('authors')
        .subscribe(response => {
          if (response && response['data'] && response['data'].length) {
            this.authors = response['data'];
            this.authors.map(author => {
              if (author._embeds && author._embeds.length) {
              author._embeds.map(embed => {
                if (embed.content && embed.content.spotlight) {
                  author.spotlight = embed.content.spotlight;
                }
                // if (embed.works) {
                //   author.works = embed.works;
                // }
              });
            }
            });
            this.isLoaded = true;
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // getArticle(currInfo) {
  //   const url = '/jsonapi/node/' + currInfo.type;
  //   let fieldName;
  //   if (currInfo.type === 'article') {
  //     fieldName = 'field_related_authors';
  //   } else if (currInfo.type === 'recipe') {
  //     fieldName = 'field_related_books';
  //   }

  //   this.enhanced.setFilter('_format', 'api_json');
  //   this.enhanced.setFilter('filter[nidFilter][condition][path]', 'nid');
  //   this.enhanced.setFilter('filter[nidFilter][condition][value]', currInfo.id);

  //   this.enhanced.mapData(url);

  //   this.enhanced.getResponse(data => {
  //     if (data.data && data.data.length) {
  //       data.data.map(node => {
  //         if (node.attributes[fieldName]) {
  //           node.attributes[fieldName].map(id => {
  //             if (!isNaN(parseFloat(id)) && isFinite(id)) {
  //               this.ids.push(id);
  //             }
  //           });

  //           this.isLoaded = true;
  //         }
  //       });
  //     }
  //   });
  // }
}
