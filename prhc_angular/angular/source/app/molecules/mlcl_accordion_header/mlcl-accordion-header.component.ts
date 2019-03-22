import {
  Component,
  EventEmitter,
  Input,
  Output,
  Injectable
} from '@angular/core';
import { TealiumUtagService } from '../../services/utag.service';

@Component({
  selector: 'mlcl-accordion-header',
  templateUrl: './mlcl-accordion-header.component.html',
})
@Injectable()
export class MlclAccordionHeaderComponent {
  @Input() id: string;
  @Input() heading = '';
  @Input() headingTag: any;
  @Input() onTourFlag = false;
  @Input() icon = 'chevron-down';
  @Output() accordionOpen = new EventEmitter<any>();

  constructor ( private tealium: TealiumUtagService ) {}

  // Toggle the accordion on click
  open() {
    this.accordionOpen.emit(true);

    if (this.icon === 'chevron-down') {
      this.tealium.track('link', {
        'module_type': 'Accordion',
        'module_variation': this.heading,
      });
    }

  }
}
