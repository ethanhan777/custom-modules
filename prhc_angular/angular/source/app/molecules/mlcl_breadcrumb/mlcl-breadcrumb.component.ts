import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'mlcl-breadcrumb',
  templateUrl: './mlcl-breadcrumb.component.html',
})
export class MlclBreadcrumbComponent {
  @Input() breadcrumbItems = [];
}
