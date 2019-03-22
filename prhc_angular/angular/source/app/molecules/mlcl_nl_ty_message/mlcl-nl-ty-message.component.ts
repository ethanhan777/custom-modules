import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { customTitle } from '../../services/enhanced_api.service';

@Component({
  selector: 'mlcl-nl-ty-message',
  templateUrl: './mlcl-nl-ty-message.component.html',
})
export class MlclNlTyMessageComponent implements OnInit {
  @Input() mcguid: string;
  @Input() prefNames = [];
  prefList = [];

  ngOnInit() {
    if (this.prefNames.length) {
      this.prefNames.map(pref => {
        // add a comma and space to each preference except the last
        if (this.prefNames.indexOf(pref) + 1 !== this.prefNames.length) {
          pref = customTitle(pref) + ', ';
        } else {
          pref = customTitle(pref);
        }
        this.prefList.push(pref);
      });
    }
  }
}
