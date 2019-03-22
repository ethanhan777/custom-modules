import {
  Component,
  Output,
  EventEmitter
} from '@angular/core';
import { isValidEmail } from '../../services/common.service';

@Component({
  selector: 'mlcl-nl-global-form',
  templateUrl: './mlcl-nl-global-form.component.html',
})
export class MlclNlGlobalFormComponent {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSignup = new EventEmitter<any>();
  mcguid: string;
  email = '';
  legalFlag = false;

  signup() {
    if (this.isValidForm()) {
      this.onSignup.emit({
        Email: this.email,
      });
    }
  }

  isValidForm(legalFlag?) {
    if (
      legalFlag ||
      legalFlag === false
    ) {
      this.legalFlag = legalFlag;
    }

    if (
      this.legalFlag &&
      this.email.length > 0 &&
      isValidEmail(this.email)
    ) {
      return true;
    }

    return false;
  }
}
