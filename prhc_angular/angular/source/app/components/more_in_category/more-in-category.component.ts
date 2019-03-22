import {
  Component,
  OnInit,
  Input,
  Injectable,
  OnDestroy
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo,
  bannedCategories
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const moreInCategorySelector = 'more-in-category';

@Component({
  selector: moreInCategorySelector,
  templateUrl: './more-in-category.component.html',
})
@Injectable()
export class MoreInCategoryComponent implements OnInit, OnDestroy {
  @Input() numberOfSlide = 0;
  @Input() isbn: string;
  categories = [];
  ignoreWorkId: string;
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor ( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();
    this.isbn = this.isbn ? this.isbn : currentContentInfo.isbn;
    this.ignoreWorkId = currentContentInfo.id;
    this.subscriptions.add(
      this.enhanced
        .getTitleCategories(this.isbn, this.numberOfSlide)
        .subscribe(response => {
          if (response['data'] && response['data'].length) {
            response['data'].map(category => {
              if (
                bannedCategories.indexOf(category.catId) < 0 &&
                this.categories.length < 2
              ) {
                this.categories.push(category);
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
}
