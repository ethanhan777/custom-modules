import {
  Component,
  OnInit,
  Input,
  Injectable
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';

@Component({
  selector: 'atm-inline-image',
  templateUrl: './atm-inline-image.component.html',
})
@Injectable()
export class AtmInlineImageComponent implements OnInit {
  @Input() apiUrl: string;
  @Input() imagePath: string;
  @Input() imageAlt = '';

  constructor (private prhcApi: PrhcApiService) {}

  ngOnInit() {
    if (this.apiUrl) {
      this.prhcApi.getData(this.apiUrl)
        .subscribe(response => {
          this.imagePath = response['data'].attributes.url;
        });
    }
  }
}
