import { Component } from '@angular/core';

export const appComponentSelector = 'prhc-root';

@Component({
  selector: appComponentSelector,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'prhc';
}
