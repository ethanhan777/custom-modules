import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'mlcl-nl-subscriber',
  templateUrl: './mlcl-nl-subscriber.component.html',
})
export class MlclNlSubscriberComponent {
  @Input() subscriber: any;
  @Input() mcguid: string;
  @Output() userProfile = new EventEmitter<any>();

  updateUserProfile() {
    this.userProfile.emit(this.subscriber);
  }
}
