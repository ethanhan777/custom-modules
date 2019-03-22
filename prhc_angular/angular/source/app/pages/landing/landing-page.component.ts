import {
  Component,
  OnInit,
  Injectable,
} from '@angular/core';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';
import { TealiumUtagService } from '../../services/utag.service';

export const landingPageSelector = 'landing-page';

@Component({
  selector: landingPageSelector,
  templateUrl: './landing-page.component.html',
})
@Injectable()
export class LandingPageComponent implements OnInit {
  imprint: any;
  pageType = 'default';

  constructor( private tealium: TealiumUtagService ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();

    if (currentContentInfo.type) {
      this.pageType = currentContentInfo.type;
    }
    this.sendTealiumData(this.pageType);
  }

  sendTealiumData(type) {
    const utagData = {
      'page_type': type,
      'page_name': type + '-landing',
    };

    this.tealium.track('view', utagData);
  }
}
