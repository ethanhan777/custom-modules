import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'mlcl-nl-confirm-message',
  templateUrl: './mlcl-nl-confirm-message.component.html',
})
export class MlclNlConfirmMessageComponent {
  @Input() linkFlag = true;
  @Input() message: string;
  @Output() clicked = new EventEmitter<any>();

  onClick() {
    this.clicked.emit();
  }
}
