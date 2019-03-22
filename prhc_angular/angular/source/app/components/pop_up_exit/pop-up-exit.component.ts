import {
  Component,
  OnInit,
  AfterViewInit,
  Injectable,
  ElementRef,
  ViewChild,
  HostListener
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { setAquisitionCode } from '../../services/mws_api.service';
import { TealiumUtagService } from '../../services/utag.service';
import { getFormattedDateSimple } from '../../services/date_format.service';
import * as ouibounce from 'ouibounce';

export const popUpExitSelector = 'pop-up-exit';

@Component({
  selector: popUpExitSelector,
  templateUrl: './pop-up-exit.component.html',
})
@Injectable()
export class PopUpExitComponent implements OnInit, AfterViewInit {
  popup: any;
  urlMatch = false;
  lastScrollTop = 0;
  @ViewChild('ouibounce') ouibouncePopup: ElementRef;

  constructor (
    private prhcApi: PrhcApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    // only show a popup if popup does not exist in local storage
    const currentStorage = sessionStorage.getItem('exit-popup');
    if (!currentStorage) {
      this.prhcApi
        .getPopup('exit')
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
          }
        });
    }
  }

  ngAfterViewInit() {
    const _ouibounce = ouibounce(false, {
      aggressive: true,
      timer: 0,
      callback: function() {
        _ouibounce.disable();
        const el = document.getElementById('ouibounce-modal');
        if (el) {
          el.className += ' active';
        }
        // add popup to local storage so no more popups will appear
        sessionStorage.setItem('exit-popup', 'true');
      }
    });
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const el = document.getElementById('ouibounce-modal');

    if (
      st > this.lastScrollTop &&
      el &&
      el.classList['value'].split(' ').indexOf('active') > 0
    ) {
      el.classList.remove('active');
    }

    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  onClick(title) {
    this.tealium.track('link', {
      'module_type' : 'Exit Pop Up',
      'module_variation' : title,
    });
  }
}
