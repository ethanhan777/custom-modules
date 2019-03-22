import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'mlcl-nl-signup-header',
  templateUrl: './mlcl-nl-signup-header.component.html',
})
export class MlclNlSignupHeaderComponent {
  @Input() headerLabel: string;
  @Output() footerForm = new EventEmitter<any>();
  toggle = true;

  // Open and close the footer on click
  formToggle() {
    this.toggle = !this.toggle;
    this.footerForm.emit(this.toggle);
  }
}
