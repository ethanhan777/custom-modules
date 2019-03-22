import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { isValidEmail } from '../../services/common.service';
// import { TealiumUtagService } from '../../services/utag.service';

@Component({
  selector: 'mlcl-nl-context-form',
  templateUrl: './mlcl-nl-context-form.component.html',
})
export class MlclNlContextFormComponent {
  @Input() contentType: string;
  @Input() noSignupButton = false;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSignup = new EventEmitter<any>();
  @Output() validFormFlag = new EventEmitter<any>();
  @Output() stepAction = new EventEmitter<any>();

  email = '';
  postalCode = '';
  showLeagl = false;
  legalFlag = false;
  stepForwardLabel = 'Skip and Get Results';

  // constructor (private tealium: TealiumUtagService) {}

  signup() {
    if (this.isValidForm()) {
      // disabled because of conflict from backend #1433
      // if (this.noSignupButton) {
      //   // send tealium data
      //   this.tealium.track ('link', {
      //     'module_type': 'Quiz Submission Type',
      //     'module_variation': 'Sign Up',
      //   });
      // }

      this.onSignup.emit({
        Email: this.email,
        Pc: this.postalCode,
      });
    }
  }

  onFocus() {
    this.showLeagl = true;
    this.stepForwardLabel = 'Skip';
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
      this.validFormFlag.emit(true);
      return true;
    }

    this.validFormFlag.emit(false);
    return false;
  }

  step(action, label?) {
    // disabled because of conflict from backend #1433
    if (label) {
    //   // send tealium data
    //   this.tealium.track ('link', {
    //     'module_type': 'Quiz Submission Type',
    //     'module_variation': label,
    //   });
    }

    this.stepAction.emit(action);
  }
}
