import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'mlcl-nav-item',
  templateUrl: './mlcl-nav-item.component.html',
})
export class MlclNavItemComponent implements OnInit {
  @Input() navItem: string;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSliderInit = new EventEmitter<any>();
  navLink: string;

  ngOnInit() {
    // replace spaces with dashes and force lowercase
    this.navLink = this.navItem.replace(' ', '-').toLowerCase();
    this.onSliderInit.emit(true);
  }
}
