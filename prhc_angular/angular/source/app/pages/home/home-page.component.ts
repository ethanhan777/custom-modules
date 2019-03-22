import {
  Component,
  OnInit,
  Injectable,
} from '@angular/core';
import { TealiumUtagService } from '../../services/utag.service';

export const homePageSelector = 'home-page';

@Component({
  selector: homePageSelector,
  templateUrl: './home-page.component.html',
})
@Injectable()
export class HomePageComponent implements OnInit {
  constructor(private tealium: TealiumUtagService) {}

  ngOnInit() {
    this.tealium.track('view', {
      'page_type': 'homepage',
      'page_name': 'Homepage',
    });
  }
}
