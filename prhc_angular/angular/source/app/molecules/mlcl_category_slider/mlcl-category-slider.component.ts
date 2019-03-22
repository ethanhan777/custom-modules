import {
  Component,
  OnInit,
  Input,
  Injectable,
  OnDestroy,
} from '@angular/core';
import {
  EnhancedApiService,
  customTitle
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

@Component({
  selector: 'mlcl-category-slider',
  templateUrl: './mlcl-category-slider.component.html',
})
@Injectable()
export class MlclCategorySliderComponent implements OnInit, OnDestroy {
  @Input() category: any;
  @Input() isSeries = false;
  @Input() ignoreWorkId: string;
  @Input() ignoreSeriesCode: string;
  @Input() heading;
  headingTag = {};
  recordCount = 0;
  viewAllFlag = false;
  viewAllUrl: string;
  data = [];
  type: string;
  private subscriptions = new Subscriber();

  constructor ( private enhanced: EnhancedApiService) {}

  ngOnInit() {
    const catUrl = '/categories/' + this.category.catId + this.category.catUri;

    if (!this.heading) {
      this.heading = 'More in ';
    }

    // set block title
    this.headingTag = {
      name: customTitle(this.category.description),
      seoFriendlyUrl: catUrl,
    };

    this.viewAllUrl = catUrl;

    if (this.isSeries) {
      this.type = 'series';
      this.subscriptions.add(
        this.enhanced
          .getCategorySeries(this.category.catId, this.ignoreSeriesCode)
          .subscribe(response => {
            if (response['data'] && response['data'].length) {
              response['data'].map(set => {
                set.title = set.seriesName;
                set.code = set.seriesCode;
                this.data.push(set);
              });
            }
          })
      );
    } else {
      this.subscriptions.add(
        this.enhanced
          .getCategoryWorks(this.category.catId, this.ignoreWorkId)
          .subscribe(response => {
            const works = [];
            if (response.canadaDivision && response.canadaDivision['data']) {
              works['recordCount'] = response.canadaDivision['recordCount'];
              works['data'] = response.canadaDivision['data'];

              if (
                works['recordCount'] < 15 &&
                response.usDivision &&
                response.usDivision['data']
              ) {
                works['recordCount'] += response.usDivision['recordCount'];
                response.usDivision['data'].map(work => {
                  if (works['data'].length <= 15) {
                    works['data'].push(work);
                  }
                });
              }
            } else if (response.usDivision && response.usDivision['data']) {
              works['recordCount'] = response.usDivision['recordCount'];
              works['data'] = response.usDivision['data'];
            }

            const recordCount = works['recordCount'];
            this.data = works['data'];
            this.viewAllFlag = recordCount > 15;
          })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
