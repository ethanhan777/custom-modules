import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import {
  PrhcApiService
} from '../../services/prhc_api.service';

export const webformListSelector = 'webform-list';

@Component({
  selector: webformListSelector,
  templateUrl: './webform-list.component.html',
})
@Injectable()
export class WebformListComponent implements OnInit {
  articles = [];
  start = 0;
  loading = false;
  isLoaded = false;
  noContent = false;

  constructor( private prhcApi: PrhcApiService ) {}

  ngOnInit() {
    this.prhcApi.getWebforms()
      .subscribe(response => {
        if (!response.length) {
          this.noContent = true;
          this.isLoaded = true;
        } else {
          this.articles = response;
          this.isLoaded = true;
        }
      });
  }
}
