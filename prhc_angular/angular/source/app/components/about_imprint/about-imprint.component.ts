import {
  Component,
  OnInit,
  Injectable,
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const aboutImprintSelector = 'about-imprint';

@Component({
  selector: aboutImprintSelector,
  templateUrl: './about-imprint.component.html',
})
@Injectable()
export class AboutImprintComponent implements OnInit {
  links = [];
  imprint: any;
  isDesc = true;
  hasCover = false;
  isLoaded = false;
  readMoreLink: string;
  private subscriptions = new Subscriber();

  constructor( private prhcApi: PrhcApiService ) {}

  ngOnInit() {
    const currentUrl = window.location.pathname;
    const  imprintCode = currentUrl.split('/')[2];

    this.subscriptions.add(
      this.prhcApi.getImprint(imprintCode)
      .subscribe(response => {
        if (response && response['data'].length) {
          response['data'].map(currentImprint => {
          this.imprint = currentImprint.attributes;
          this.imprint.bio = currentImprint.attributes.field_imprint_bio;
          this.imprint.about_section_title = currentImprint.attributes.field_about_section_title;
          this.imprint.cover = undefined;

          if (this.imprint.about_section_title || this.imprint.field_body) {
            this.readMoreLink = currentUrl + '/about';
          }

          if (currentImprint.relationships.field_imprint_logo.data) {
            this.imprint.logoId = currentImprint.relationships.field_imprint_logo.data.id;
          }
        });
        // check for logo image
        if (response['included'] && this.imprint.logoId) {
          response['included'].map(imprintImage => {
            if (this.imprint.logoId === imprintImage.id) {
              this.imprint.cover = imprintImage.attributes.url;
            }
          });
        }
        this.isLoaded = true;
        }
      })
    );
  }
}
