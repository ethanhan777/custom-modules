import {
  Component,
  OnInit,
  OnDestroy,
  Injectable,
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { EnhancedApiService } from '../../services/enhanced_api.service';

export const authorsOnTourSelector = 'authors-on-tour';

@Component({
  selector: authorsOnTourSelector,
  templateUrl: './authors-on-tour.component.html',
})
@Injectable()
export class AuthorsOnTourComponent implements OnInit, OnDestroy {
  data: any[] = [];
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    // get api data
    this.subscriptions.add(
      this.enhanced
        .getAuthorsOnTour()
        .subscribe(response => {
          if (response.data && response.data.length) {
            response.data.map(author => {
              this.data.push(author);
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
