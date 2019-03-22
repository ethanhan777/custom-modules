import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  Injectable
} from '@angular/core';

import {
  TealiumUtagService,
  parseUtagLinkTitle
} from '../../services/utag.service';

@Component({
  selector: 'atm-buy-button',
  templateUrl: './atm-buy-button.component.html',
})
@Injectable()
export class AtmBuyButtonComponent implements OnInit, OnChanges {
  buyWorkflow: boolean;
  label: string;
  @Input() onSaleDate;
  @Input() title;
  @Output() clickedBuy = new EventEmitter<any>();

  constructor ( private tealium: TealiumUtagService ) {}

  ngOnInit() {
    this.label = setLabelByDate(this.onSaleDate);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.onSaleDate && changes.onSaleDate.previousValue) {
      const onSaleDate: SimpleChange = changes.onSaleDate;
      this.onSaleDate = onSaleDate.currentValue;
      this.label = setLabelByDate(this.onSaleDate);
    }
  }

  buttonClicked() {
    this.buyWorkflow = true;
    this.clickedBuy.emit(this.buyWorkflow);

    if (this.title) {
      // send tealium data
      const utagData = parseUtagLinkTitle(this.title);

      // send tealium page load event
      this.tealium.track('link', utagData);
    }
  }
}

export function setLabelByDate(onSaleDate) {
  const currentDate = new Date();
  const pubDate = new Date(onSaleDate.replace(/-/g, '/'));

  if (currentDate >= pubDate) {
    return 'Where to Buy';
  } else {
    return 'Pre-Order';
  }
}
