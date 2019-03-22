import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'mlcl-nav-slider',
  templateUrl: './mlcl-nav-slider.component.html',
})
export class MlclNavSliderComponent implements AfterViewInit {
  @Input() type: string;
  @Input() active: string;
  @Input() data: any;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSliderInit = new EventEmitter<any>();
  @Output() buttonClicked = new EventEmitter<any>();
  slides = [];

  config: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto',
    watchOverflow: true,
    grabCursor: true,
    spaceBetween: 5,
    initialSlide: 0,
    navigation: {
      nextEl: '.slider-arrow-right',
      prevEl: '.slider-arrow-left',
    },
  };
  @ViewChild('navWrapper') navWrapper: ElementRef;

  ngAfterViewInit() {
    if (this.navWrapper.nativeElement.children[0].clientWidth < this.navWrapper.nativeElement.children[0].children[0].scrollWidth) {
      this.navWrapper.nativeElement.children[0].children[0].classList.add('mlcl_nav-overflow');
    }
  }

  changeSlider(event) {
    console.log(event);
  }

  isClicked(name) {
    this.buttonClicked.emit(name);
  }
}
