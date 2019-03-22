import {
  Component,
  Injectable,
  Input
} from '@angular/core';

@Component({
  selector: 'mlcl-reco-cta',
  templateUrl: './mlcl-reco-cta.component.html',
})
@Injectable()
export class MlclRecoCTAComponent {
  @Input() heading: string;
  @Input() paragraph: string;
  @Input() url = '';
}
