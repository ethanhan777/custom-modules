import {
  Component,
  OnDestroy,
  Input,
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import * as geolib from 'geolib';

@Component({
  selector: 'mlcl-buy-independent',
  templateUrl: './mlcl-buy-independent.component.html',
})
export class MlclBuyIndependentComponent implements OnDestroy {
  @Input() isbn: string;
  indieSearchTerm: string;
  indieListOn = true;
  indieMapOn = false;
  private subscriptions = new Subscriber();
  message = '';
  resultMessage = '';
  retailerCount = 0;
  loading = false;
  loadMoreFlag = false;
  // indies
  private retailers = [];
  retailersList = [];
  retailersMap = [];
  myLocation = {
    lat: 43.6436658,
    lng: -79.3931166,
  };
  mapZoom = 15;

  constructor (private prhcApi: PrhcApiService) {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // get the search value
  search() {
    if (this.indieSearchTerm) {
      // reset
      this.loading = true;
      this.retailers = [];
      this.retailersList = [];
      this.retailersMap = [];

      this.prhcApi
        .getRetailers(this.indieSearchTerm, this.isbn)
        .subscribe(retailers => {
          if (
            retailers['location'] &&
            retailers['location'].geometry &&
            retailers['location'].geometry.location
          ) {
            this.myLocation = retailers['location'].geometry.location;
          }

          if (
            retailers['data'] &&
            retailers['data'].length &&
            retailers['location']
          ) {
            if (retailers['location'].types[0] === 'administrative_area_level_1') {
              this.mapZoom = 5;
              retailers['data'].map(retailer => {
                this.retailers.push(retailer);
              });
            } else {
              if (retailers['location'].types[0] === 'locality') {
                this.mapZoom = 12;
              }

              const testList = [];
              retailers['data'].map(retailer => {
                testList[retailer.nid] = {latitude: retailer.coordinates.lat, longitude: retailer.coordinates.lon};
              });
              const results = geolib.orderByDistance({latitude: this.myLocation.lat, longitude: this.myLocation.lng}, testList);

              results.map(result => {
                retailers['data'].map(retailer => {
                  if (+result.key === retailer.nid && result.distance < 100000) {
                    this.retailers.push(retailer);
                  }
                });
              });
            }
          }

          const retailerCount = this.retailers.length;

          if (this.retailers.length === 0) {
            this.message = 'Sorry, we couldn\'t find independent retailers within 100 KM of ' +
              '"<strong>' + this.indieSearchTerm + '</strong>" at this time';
            if (
              retailers['location'] &&
              retailers['location'].country_code !== 'CA'
            ) {
              this.message = 'It looks like "<strong>' + this.indieSearchTerm + '</strong>" is outside of our range.' +
                ' We\'re best at finding independent bookstores in Canada. ' +
                'If you were looking for somewhere in Canada, try again with a more specific search term ' +
                '(e.g., <strong>city + province</strong> or <strong>address + city</strong>).';
            }

          } else {
            this.retailers.map(retailer => {
              this.retailersMap.push(retailer);
            });

            if (this.retailers.length > 36) {
              this.retailersList = this.retailers.splice(0, 36);
              this.loadMoreFlag = true;
            } else {
              this.retailersList = this.retailers;
            }

            this.message = '';
            const bookstore = retailerCount > 1 ? ' independent bookstores' : ' independent bookstore' ;
            this.resultMessage = retailerCount + bookstore + ' near "' + this.indieSearchTerm + '"';
            if (
              retailers['location'].types[0] === 'administrative_area_level_1' ||
              retailers['location'].types[0] === 'locality'
            ) {
              this.resultMessage = retailerCount + bookstore + ' in "' + this.indieSearchTerm + '"';
            }
          }

          if (
            retailers['location'] &&
            retailers['location'].types[0] === 'country'
          ) {
            this.message = '"<strong>' + this.indieSearchTerm + '</strong>" is too broad. ' +
              'Try searching by your province, city, postal code, or address.';
          }
          this.loading = false;
        });
    }
  }

  // toggle the list and map view
  indieDisplay(type) {
    if (
      (type === 'list' && this.indieMapOn) ||
      (type === 'map' && this.indieListOn)
    ) {
      this.indieListOn = !this.indieListOn;
      this.indieMapOn = !this.indieMapOn;
    }
  }

  loadMoreRetailers() {
    const next = this.retailers.splice(0, 36);
    this.retailersList = this.retailersList.concat(next);

    if (this.retailers.length === 0) {
      this.loadMoreFlag = false;
    }
  }

}
