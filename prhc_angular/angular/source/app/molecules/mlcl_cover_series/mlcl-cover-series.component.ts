import {
  Component,
  OnInit,
  Input,
  Injectable,
  OnDestroy
} from '@angular/core';
import { EnhancedApiService } from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

// ###########################################
// TODO: move this logic up to parent component.
// ###########################################
@Component({
  selector: 'mlcl-cover-series',
  templateUrl: './mlcl-cover-series.component.html',
})
@Injectable()
export class MlclCoverSeriesComponent implements OnInit, OnDestroy {
  @Input() seriesCode: string;
  @Input() seriesUrl = '';
  @Input() seriesName = '';
  imageCount = 3;
  covers = [];
  coverWidth = '63';
  gridImageFallback = '';
  fallbackImage = '';
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    // Array of fallback images
    // TODO: make URLs safe for Angular
    const noImagePatterns = [
      '\'../../../../themes/custom/penguin/images/no-image-fallback/no-image-pattern-1.png\'',
      '\'../../../../themes/custom/penguin/images/no-image-fallback/no-image-pattern-2.png\'',
      '\'../../../../themes/custom/penguin/images/no-image-fallback/no-image-pattern-3.png\'',
      '\'../../../../themes/custom/penguin/images/no-image-fallback/no-image-pattern-4.png\'',
      '\'../../../../themes/custom/penguin/images/no-image-fallback/no-image-pattern-5.png\'',
      '\'../../../../themes/custom/penguin/images/no-image-fallback/no-image-pattern-6.png\'',
    ];

    if (this.seriesCode) {
      this.subscriptions.add(
        this.enhanced.getSeriesWorks(this.seriesCode)
          .subscribe(response => {
            if (response['data'] && response['data'].length) {
              if (response['recordCount'] < 4) {
                this.imageCount = response['recordCount'];
              }
              response['data'].map(work => {
                this.covers.push('https://images.randomhouse.com/cover/' + work.isbn);
              });

              if (this.imageCount === 2) {
                this.coverWidth = '105';
              } else if (this.imageCount === 1) {
                this.coverWidth = '116';
              }
            }
            if (!this.covers.length) {
              // Randomly choose a fallback image
              this.fallbackImage = noImagePatterns[Math.floor(Math.random() * noImagePatterns.length)];
              this.gridImageFallback = 'mlcl_grid-no-image';
            }
          })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
