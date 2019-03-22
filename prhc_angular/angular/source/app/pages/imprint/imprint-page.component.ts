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

export const imprintPageSelector = 'imprint-page';

@Component({
  selector: imprintPageSelector,
  templateUrl: './imprint-page.component.html',
})
@Injectable()
export class ImprintPageComponent implements OnInit, OnDestroy {
  imprint: any;
  pageType = 'default';
  private subscriptions = new Subscriber();

  constructor(
    private enhanced: EnhancedApiService,
    private tealium: TealiumUtagService
  ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();

    if (currentContentInfo.last) {
      this.pageType = currentContentInfo.last;
    }

    this.subscriptions.add(
      this.enhanced
        .getImprint(currentContentInfo.id)
        .subscribe(response => {
          if (response['data'] && response['data'].length) {
            this.imprint = response['data'][0];
            this.sendTealiumData(this.imprint, this.pageType);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendTealiumData(imprint, type) {
    let pageType = 'imprints';

    if (type === 'about') {
      pageType += '-about';
    } else if (type === 'books') {
      pageType += '-all-books';
    } else if (type === 'authors') {
      pageType += '-all-authors';
    }

    this.tealium.track('view', {
      'page_type': pageType,
      'page_name': imprint.description,
    });
  }
}
