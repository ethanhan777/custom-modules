import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'mlcl-contributed-by-author',
  templateUrl: './mlcl-contributed-by-author.component.html',
})
export class MlclContributedByAuthorComponent {
  @Input() works = [];
}
