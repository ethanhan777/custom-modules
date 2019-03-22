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

export const categoryPageSelector = 'category-page';

@Component({
  selector: categoryPageSelector,
  templateUrl: './category-page.component.html',
})
@Injectable()
export class CategoryPageComponent implements OnInit, OnDestroy {
  category: any;
  pageType = 'default';
  private subscriptions = new Subscriber();

  constructor(
    private enhanced: EnhancedApiService,
    private tealium: TealiumUtagService
  ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();
    if (currentContentInfo.type === 'excerpts' || currentContentInfo.type === 'book-club-resources') {
      this.pageType = currentContentInfo.type;
    }

    this.subscriptions.add(
      this.enhanced
        .getCategory(currentContentInfo.id)
        .subscribe(response => {
          if (response['data'] && response['data'].length) {
            this.category = response['data'][0];
            this.sendTealiumData(this.category, currentContentInfo.type);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendTealiumData(category, type) {
    this.tealium.track('view', {
      'page_type': type === 'categories' ? 'categories' : type + '-by-category',
      'page_name': category.description,
    });
  }
}
