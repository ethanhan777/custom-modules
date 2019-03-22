import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { customTitle } from '../../services/enhanced_api.service';

@Component({
  selector: 'mlcl-hero-title',
  templateUrl: './mlcl-hero-title.component.html',
})
export class MlclHeroTitleComponent implements OnInit {
  @Input() type;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() contributors = [];
  @Input() series: any;

  ngOnInit() {
    this.title = customTitle(this.title);

    if (this.type) {
      this.subtitle = 'from ' + this.title;
      this.title = this.type;
    }
  }
}
