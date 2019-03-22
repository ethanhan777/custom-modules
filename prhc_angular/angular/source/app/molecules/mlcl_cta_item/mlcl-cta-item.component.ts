import {
  Component,
  Input,
  OnInit,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';
import { TealiumUtagService } from '../../services/utag.service';
@Component({
  selector: 'mlcl-cta-item',
  templateUrl: './mlcl-cta-item.component.html',
})
@Injectable()
export class MlclCTAItemComponent implements OnInit, OnDestroy {
  @Input() url;
  subheading: string;
  ctaImage: string;
  ctaImageAlt: string;
  ctaLink: string;
  ctaVideo: string;
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor (
    private prhcApi: PrhcApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.prhcApi
        .getData(this.url, 'field_cta_image')
        .subscribe(response => {
          if (response['data']) {
            this.subheading = response['data'].attributes.field_subheading;
            if (
              response['data'].relationships.field_cta_image &&
              response['data'].relationships.field_cta_image.data
            ) {
              this.ctaImage = response['data'].relationships.field_cta_image.data.meta.derivatives.large.url;
            }
            this.ctaImageAlt = response['data'].attributes.field_subheading
              ? response['data'].attributes.field_subheading
              : '';
            if (response['data'].attributes.field_cta_link) {
              this.ctaLink = response['data'].attributes.field_cta_link;
            }
            if (response['data'].attributes.field_hero_video) {
              this.ctaVideo = response['data'].attributes.field_hero_video;
            }

            this.isLoaded = true;
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onClick() {
    let moduleType = 'Campaign CTA';
    if (getCurrentContentInfo().type === 'imprints') {
      moduleType = 'Imprint CTA';
    }

    this.tealium.track('link', {
      'module_type': moduleType,
      'module_variation': this.subheading ? this.subheading : '',
    });
  }
}
