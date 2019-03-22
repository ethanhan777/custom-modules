import {
  Component,
  OnInit,
  Injectable,
} from '@angular/core';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';
import { TealiumUtagService } from '../../services/utag.service';

export const eventLocationPageSelector = 'event-location-page';

@Component({
  selector: eventLocationPageSelector,
  templateUrl: './event-location-page.component.html',
})
@Injectable()
export class EventLocationPageComponent implements OnInit {
  constructor(private tealium: TealiumUtagService) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();
    this.tealium.track('view', {
      'page_type': 'events-by-province',
      'page_name': currentContentInfo.name + ' events',
    });
  }
}
