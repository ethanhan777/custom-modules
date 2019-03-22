import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'mlcl-event-list-item',
  templateUrl: './mlcl-event-list-item.component.html',
})
export class MlclEventListItemComponent implements OnInit {
  @Input() type: string;
  @Input() content: any;

  ngOnInit() {
    if (this.content) {
      this.content.eventId = this.content.eventId
        ? this.content.eventId
        : this.content.id;
    }
  }
}
