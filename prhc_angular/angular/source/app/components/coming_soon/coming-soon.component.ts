import {
  Component,
  OnInit,
  OnDestroy,
  Injectable,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo,
  parseFrontlistiestWorkForCategory,
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const comingSoonSelector = 'coming-soon';

@Component({
  selector: comingSoonSelector,
  templateUrl: './coming-soon.component.html',
})
@Injectable()
export class ComingSoonComponent implements OnInit, OnDestroy {
  data = [];
  isLoaded = false;
  private subscriptions = new Subscriber();
  @Output() hasComingSoon = new EventEmitter<any>();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    const currentContentInfo = getCurrentContentInfo();

    if (currentContentInfo.type === 'imprints') {
      this.subscriptions.add(
        this.enhanced
          .getComingSoonImprints({imprintCode: currentContentInfo.id})
          .subscribe(response => {
            this.data = response.data;
            this.isLoaded = this.data.length > 0;
            this.hasComingSoon.emit(this.isLoaded);
          })
      );
    } else if (currentContentInfo.type === 'categories') {
      this.subscriptions.add(
        this.enhanced
          .getComingSoonCategory(
            currentContentInfo.id,
            { usDivision: true }
          )
          .map(response => parseFrontlistiestWorkForCategory(response, currentContentInfo.id))
          .subscribe(response => {
            if (response.data && response.data.length) {
              // add works into works
              response.data.map(work => {
                this.data.push(work);
              });

              this.isLoaded = this.data.length > 0;
            }
          })
      );
    } else {
      this.subscriptions.add(
        this.enhanced
        .getComingSoon(currentContentInfo.type, { usDivision: true })
        .subscribe(response => {
          if (response['data'] && response['data'].length) {
            // add works into works
            response['data'].map(work => {
              this.data.push(work);
            });

            this.isLoaded = this.data.length > 0;
          }
        })
      );
    }

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
