import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Injectable
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscriber } from 'rxjs/Subscriber';
import { PrhcApiService } from '../../services/prhc_api.service';
import { MWSApiService } from '../../services/mws_api.service';
import {
  isValidEmail,
  provinceStates
} from '../../services/common.service';
import { TealiumUtagService } from '../../services/utag.service';

export const mlclFormSelector = 'mlcl-form';

@Component({
  selector: mlclFormSelector,
  templateUrl: './mlcl-form.component.html',
})
@Injectable()
export class MlclFormComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscriber();
  @Input() formElements = [];
  @Input() campaignTitle: string;
  @Input() webformAttr: any;
  @Input() officialRule: any;
  @Input() acquisitionCode: string;
  @Input() preferences = [];
  @Input() webformConsent: any;
  isLoaded = false;
  formInFocus = false;
  formValidationMessage = '';
  webformMessage = '';
  email = '';
  isValidEmail = false;
  isLegalChecked = false;
  provinceOptions = [];
  provinceState = '';
  radioSelected = '';
  multipleCheckboxes = [];

  constructor (
    private prhcApi: PrhcApiService,
    private mwsApi: MWSApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    // handles multiple checkboxes separately.
    this.formElements.map(formEl => {
      if (formEl.type === 'checkboxes') {
        this.multipleCheckboxes.push({
          name: formEl.name,
          label: formEl.label,
          values: []
        });
      }
    });

    // display open/closed Message.
    if (this.webformAttr.status === 'closed') {
      this.webformMessage = this.webformAttr.settings.form_close_message;

    } else if (this.webformAttr.status === 'scheduled') {
      const now = new Date();
      if (this.webformAttr.open) {
        const webformOpen = new Date(this.webformAttr.open);
        if (webformOpen > now) {
          this.webformMessage = this.webformAttr.settings.form_open_message;
        }
      }

      if (this.webformAttr.close) {
        const webformClose = new Date(this.webformAttr.close);
        if (webformClose <= now) {
          this.webformMessage = this.webformAttr.settings.form_close_message;
        }
      }
    }

    // set default province
    this.provinceOptions = provinceStates
      .filter(provinceState => provinceState.country === 'CA');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadProvinces(countryName) {
    this.provinceOptions = provinceStates
      .filter(provinceState => provinceState.country === countryName);
    this.provinceState = '';
  }

  emailInFocus() {
    // Hide everything but the email field on load. Show the rest when email is in focus
    this.formInFocus = true;
  }

  isEmailValid() {
    this.isValidEmail = isValidEmail(this.email);

    return this.isValidEmail;
  }

  isValidNlForm(event?) {
    if (event) {
      this.isLegalChecked = event;
    }

    return this.isLegalChecked && this.isValidEmail && this.email.length;
  }

  onSubmit(f: NgForm) {
    this.formValidationMessage = '';
    const invalidElNames = [];

    // special validation for multiple checkboxes.
    // note. can't figure it out to work with ngForm for multiple checkboxes.
    // so doing multiple checkboxes validation separately.
    let isCheckboxesValid = false;
    if (this.multipleCheckboxes.length) {
      this.multipleCheckboxes.map(checkboxesEl => {
        if (checkboxesEl.values.length) {
          isCheckboxesValid = true;
        } else {
          invalidElNames.push(checkboxesEl.label);
        }
      });
    } else {
      isCheckboxesValid = true;
    }

    // check if the consent field is required and if it's entered
    let consentRequiredValid = true;
    if (this.webformConsent && this.webformConsent.consentRequired && !this.isValidNlForm()) {
      consentRequiredValid = false;
    }

    // all valid! let's submit!
    if (f.form.status === 'VALID' && isCheckboxesValid && consentRequiredValid) {
      const formData = f.form.value;
      // parse address data
      if (formData.address) {
        formData.address = {
          address: formData.address,
          address_2: formData.address_2,
          city: formData.city,
          country: formData.country,
          postal_code: formData.postal_code,
          state_province: formData.state_province,
        };
        delete formData['address_2'];
        delete formData['city'];
        delete formData['country'];
        delete formData['postal_code'];
        delete formData['state_province'];
      }

      if (this.multipleCheckboxes.length) {
        this.multipleCheckboxes.map(checkboxesEl => {
          formData[checkboxesEl.name] = checkboxesEl.values;
        });
      }

      formData['webform_id'] = this.webformAttr.id;

      // susbscribe newsletter if user filled in email and checked newsltter checkbox
      if (this.isValidNlForm()) {
        const userInfo = {
          Email: this.email,
        };
        if (formData.first_name && formData.first_name.length) {
          userInfo['FirstName'] = formData.first_name;
        }
        if (formData.last_name && formData.last_name.length) {
          userInfo['LastName'] = formData.last_name;
        }
        if (formData.address) {
          if (formData.address.address && formData.address.address.length) {
            userInfo['Addr1'] = formData.address.address;
          }
          if (formData.address.address_2 && formData.address.address_2.length) {
            userInfo['Addr2'] = formData.address.address_2;
          }
          if (formData.address.city && formData.address.city.length) {
            userInfo['City'] = formData.address.city;
          }
          if (formData.address.state_province && formData.address.state_province.length) {
            userInfo['State'] = formData.address.state_province;
          }
          if (formData.address.postal_code && formData.address.postal_code.length) {
            userInfo['Pc'] = formData.address.postal_code;
          }
        }

        this.subscriptions.add(
          this.mwsApi
            .subscribeService(userInfo, this.acquisitionCode, this.preferences)
            .subscribe(mwsRes => {
              if (mwsRes['data'] && mwsRes['data'].StatusCode === 0) {
                let mcguid = '';
                mwsRes['data']['Msg'].map(guid => {
                  mcguid = guid.MasterContactGuid;
                });

                this.tealium.track('link', {
                  'event_type': 'newsletter_signup',
                  'newsletter_name': '210 | 21001',
                  'pid': mcguid,
                  'newsletter_acquisition_code': this.acquisitionCode,
                });
              } else {
                // log if subscription fails
                console.log(mwsRes['data'].StatusCode, mwsRes['data'].Message);
              }
            })
        );
      }

      // post webform. if successful, display confirmation message from webform setting.
      this.subscriptions.add(
        this.prhcApi.submitWebform(formData)
          .subscribe(res => {
            if (res && res['sid']) {
              this.webformMessage = this.webformAttr.settings['confirmation_message'];

              this.tealium.track('link', {
                module_type: 'Contest Entry',
                module_variation: this.campaignTitle,
              });
            }
          })
      );

    // form is not valid. gonna display validation message.
    } else {
      const controls = Object.entries(f.form.controls);
      controls.filter(el => el[1].invalid)
      .map(invalidEl => {
        this.formElements.map(formEl => {
          if (formEl.name === invalidEl[0]) {
            invalidElNames.push(formEl.label);
          }
        });
      });
      if (this.webformConsent && this.webformConsent.consentRequired && !this.isValidNlForm()) {
        invalidElNames.push('Newsletter Consent');
      }
      this.formValidationMessage = 'Please review your submission. (' + invalidElNames.join(', ') + ')';
    }
  }

  checkboxChange(event, element, option?) {
    if (option) {
      this.multipleCheckboxes.map(checkboxesEl => {
        if (checkboxesEl.name === element.name) {
          if (event.target.checked) {
            checkboxesEl.values.push(option[0]);
          } else {
            checkboxesEl.values.splice(checkboxesEl.values.indexOf(option[0]), 1);
          }
        }
      });
    } else {
      element.valueBoolean = event.target.checked ? true : undefined;
    }
  }

}
