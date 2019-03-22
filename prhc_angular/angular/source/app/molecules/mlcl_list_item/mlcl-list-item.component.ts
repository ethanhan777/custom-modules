import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'mlcl-list-item',
  templateUrl: './mlcl-list-item.component.html',
})
export class MlclListItemComponent {
  @Input() category = {
    name: undefined,
    path: undefined,
    target: '_self',
  };
  @Input() label;
  @Input() title;
  @Input() seoFriendlyUrl;
  @Input() urlTarget = '_self';
  @Input() body;
  @Input() externalFlag;
}
