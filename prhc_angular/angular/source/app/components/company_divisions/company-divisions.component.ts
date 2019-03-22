import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { accordionOpen } from '../../services/accordion.service';
import { Subscriber } from 'rxjs/Subscriber';

export const companyDivisionsSelector = 'company-divisions';

@Component({
  selector: companyDivisionsSelector,
  templateUrl: './company-divisions.component.html',
})
@Injectable()
export class CompanyDivisionsComponent implements OnInit {
  isLoaded = false;
  loading = false;
  imprint: any;
  accordion: any;
  divisions = [];

  private subscriptions = new Subscriber();

  constructor( private prhcApi: PrhcApiService ) {}

  ngOnInit() {
    this.accordion = {
      toggle: false,
      chevron: 'chevron-down',
      heading: 'Our Imprints',
      id: 'imprints',
    };

    this.subscriptions.add(
      this.prhcApi.getAllImprints()
      .subscribe(response => {
        if (response && response['data'].length) {
          // create the list of divisions
          response['included'].map(division => {
            if (division.type === 'taxonomy_term--division') {
              division.heading = division.attributes.name;
              this.divisions.push(division);
              // Sort the division alphabetically
              this.divisions.sort( function (a , b) {
                if (a.heading < b.heading) {
                  return -1;
                } else if (a.heading > b.heading) {
                  return 1;
                } else {
                  return 0;
                }
              });
            }
          });
          // match the imprints to the divisions
          this.divisions.map(currentDivision => {
            currentDivision.divisionImprints = [];
            response['data'].map(currentImprint => {
              if (
                currentImprint.relationships.field_division.data &&
                currentImprint.relationships.field_division.data.id === currentDivision.attributes.uuid
                ) {
                  this.setImprint(currentImprint, response);
                  currentDivision.divisionImprints.push(this.imprint);
                }
            });
            // Sort the imprint alphabetically
             currentDivision.divisionImprints.sort( function (a , b) {
              if (a.title < b.title) {
                return -1;
              } else if (a.title > b.title) {
                return 1;
              } else {
                return 0;
              }
            });
          });
        this.isLoaded = true;
        }
      })
    );
  }

  setImprint(imprint, response) {
    // creating the pieces of the SeoFriendlyUrl
    const code = imprint.attributes.field_imprint_code;
    const urlTitle = imprint.attributes.title.replace(/\s/g, '-');

    // the only data we need to display the imprint
    this.imprint = {
      title: imprint.attributes.title,
      cover: undefined,
      seoFriendlyUrl: `/imprints/${code}/${urlTitle}`,
    };
    // check for logo image
    if (imprint.relationships.field_imprint_logo.data) {
      this.imprint.logoId = imprint.relationships.field_imprint_logo.data.id;
    }
    // get logo image
    if (response['included'] && this.imprint.logoId) {
      response['included'].map(imprintImage => {
        if (this.imprint.logoId === imprintImage.id) {
          this.imprint.cover = imprintImage.attributes.url;
        }
      });
    }
  }

  /**
   * Toggle the accordion on click
   *
   * @param {$event} accordion header click event.
   * @param {accordion} Accordion interface object.
   */
  accordionOpen(accordion) {
    accordionOpen(accordion);
  }

}

