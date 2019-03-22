import {
  Component,
  OnInit,
  OnDestroy,
  Injectable
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { EnhancedApiService } from '../../services/enhanced_api.service';

export const comingSoonNextWeekSelector = 'coming-soon-next-week';

@Component({
  selector: comingSoonNextWeekSelector,
  templateUrl: './coming-soon-next-week.component.html',
})
@Injectable()
export class ComingSoonNextWeekComponent implements OnInit, OnDestroy {
  data = [];
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    // get api data
    this.subscriptions.add(
      this.enhanced.getComingSoon('next-week').subscribe(response => {
        if (response['data'] && response['data'].length) {
          response['data'].map(work => {
            this.data.push(work);
          });

          // ready to render data
          this.isLoaded = this.data.length > 0;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
