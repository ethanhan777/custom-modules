import {
  Component,
  OnInit,
  OnDestroy,
  Injectable
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { EnhancedApiService } from '../../services/enhanced_api.service';

export const authorsNewReleaseSelector = 'authors-new-release';

@Component({
  selector: authorsNewReleaseSelector,
  templateUrl: './authors-new-release.component.html',
})
@Injectable()
export class AuthorsNewReleaseComponent implements OnInit, OnDestroy {
  data = [];
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.enhanced.getAuthorsNewRelease().subscribe(response => {
        if (response.data && response.data.length) {
          response.data.map(author => {
            this.data.push(author);
          });

          // set isLoaded flag
          this.isLoaded = this.data.length > 0;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
