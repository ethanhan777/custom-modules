import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { setAquisitionCode } from '../../services/mws_api.service';
import { TealiumUtagService } from '../../services/utag.service';
import { getFormattedDateSimple } from '../../services/date_format.service';

export const popUpSelector = 'pop-up';

@Component({
  selector: popUpSelector,
  templateUrl: './pop-up.component.html',
})
@Injectable()
export class PopUpComponent implements OnInit {
  popup: any;
  urlMatch = false;
  lightbox = false;
  isLoaded = false;

  constructor (
    private prhcApi: PrhcApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    // only show a popup if popup does not exist in local storage
    const currentStorage = sessionStorage.getItem('popup');
    if (!currentStorage) {
      this.prhcApi
        .getPopup('lightbox')
        .subscribe(response => {
          response['data'].map(currentPopup => {
            this.popup = currentPopup;
          });

          if (this.popup) {
            // image
            if (this.popup.relationships.field_image && this.popup.relationships.field_image.data) {
              this.popup.attributes.image = this.popup.relationships.field_image.data.meta.derivatives.large.url;
              this.popup.attributes.imageAlt = this.popup.relationships.field_image.data.meta.alt;
            }

            // acquisition type
            if (this.popup.attributes.field_acquisition_type) {
              this.popup.attributes.field_acquisition_type =
                setAquisitionCode(this.popup.attributes.title) + '_' +
                this.popup.attributes.field_acquisition_type + '_' +
                getFormattedDateSimple(this.popup.attributes.created * 1000);
            }

            this.isLoaded = true;
            this.popUpTimer();
          }
        });
    }
    // Close the lightbox with the escape key
     document.onkeydown = esc => {
        if (esc.keyCode === 27) {
        this.lightboxOff();
      }
    };
  }

  // delay showing the popup for 4 second for usability
  popUpTimer() {
    setTimeout(() => {
      this.lightbox = true;
      this.isLoaded = true;
      // add popup to local storage so no more popups will appear
      sessionStorage.setItem('popup', 'true');
      // Add a class to the body to remove page scroll when lightbox is open
      document
        .getElementsByTagName('body')[0]
          .classList.add('cmpnt_popup-open');
    }, 4000);
  }

  /**
   * Turn off the lightbox
   */
  lightboxOff() {
    this.lightbox = false;
    document
      .getElementsByTagName('body')[0]
      .classList.remove('cmpnt_popup-open');
  }

  keepLightboxOn(event) {
    event.stopPropagation();
  }

  onClick(title) {
    this.tealium.track('link', {
      'module_type' : 'Pop Up',
      'module_variation' : title,
    });
  }
}
