import {
  Component,
  OnInit,
  OnDestroy,
  Injectable,
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { EnhancedApiService } from '../../services/enhanced_api.service';

export const newLastWeekSelector = 'new-last-week';

@Component({
  selector: newLastWeekSelector,
  templateUrl: './new-last-week.component.html',
})
@Injectable()
export class NewLastWeekComponent implements OnInit, OnDestroy {
  data = [];
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    // get api data
    this.subscriptions.add(
      this.enhanced.getNewReleases('last-week').subscribe(response => {
        if (response.data && response.data.length) {
          response.data.map(work => {
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
