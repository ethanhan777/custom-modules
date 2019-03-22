import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

export const authorPageSelector = 'author-page';

@Component({
  selector: authorPageSelector,
  templateUrl: './author-page.component.html',
})
@Injectable()
export class AuthorPageComponent implements OnInit, OnDestroy {
  author: any;
  private subscriptions = new Subscriber();

  constructor(
    private enhanced: EnhancedApiService,
    private tealium: TealiumUtagService
  ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();

    this.subscriptions.add(
      this.enhanced
        .getAuthor(currentContentInfo.id, 'display')
        .subscribe(response => {
          if (response['data'] && response['data'].length) {
            this.author = response['data'][0];
            this.sendTealiumData(this.author);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendTealiumData(author) {
    this.tealium.track('view', {
      'page_type': 'authors',
      'page_name': author.display,
      'product_author': author.display,
      'product_author_ID': author.authorId,
    });
  }
}
