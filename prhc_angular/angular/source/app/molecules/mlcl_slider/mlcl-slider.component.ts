import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  AfterViewInit,
} from '@angular/core';
import {
  SwiperDirective,
  SwiperConfigInterface
} from 'ngx-swiper-wrapper';

@Component({
  selector: 'mlcl-slider',
  templateUrl: './mlcl-slider.component.html',
})
export class MlclSliderComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() heading: string;
  @Input() headingTag: any;
  @Input() data: any;
  @Input() type: string;
  @Input() isEx: boolean;
  @Input() isRg: boolean;
  @Input() viewAllFlag: boolean;
  @Input() viewAllUrl: string;
  @Input() saveButtonFlag = false;
  // tslint:disable-next-line:no-output-on-prefix
  // @Output() onSliderInit = new EventEmitter<any>();
  @Output() clicked = new EventEmitter<any>();
  @Output() savedBook = new EventEmitter<any>();

  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;

  config: SwiperConfigInterface = {
    direction: 'horizontal',
    lazy: true,
    slidesPerView: 'auto',
    grabCursor: true,
    spaceBetween: 26,
    initialSlide: 0,
    watchOverflow: true,
    navigation: {
      nextEl: '.slider-arrow-right',
      prevEl: '.slider-arrow-left',
    },
  };

  ngOnInit() {
    // set default variables.
    this.type = this.type ? this.type : 'book';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.previousValue) {
      const data: SimpleChange = changes.data;
      this.data = data.currentValue;
    }

    if (this.directiveRef) {
      this.directiveRef.update();
    }
  }

  ngAfterViewInit() {
    // when slider is in accordion, because of the animation in css,
    // set timeout for 1 sec to wait the animation is finished.
    if (this.directiveRef) {
      setTimeout(() => { this.directiveRef.update(); }, 1000);
    }
  }

  onClick(title) {
    this.clicked.emit(title);
  }

  saveOnClick(status) {
    this.savedBook.emit(status);
  }
}
