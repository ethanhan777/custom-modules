import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import {
  SwiperDirective,
  SwiperConfigInterface
} from 'ngx-swiper-wrapper';
import { TealiumUtagService } from '../../services/utag.service';

export const heroCarouselSelector = 'hero-carousel';

@Component({
  selector: heroCarouselSelector,
  templateUrl: './hero-carousel.component.html',
})
@Injectable()
export class HeroCarouselComponent implements OnInit, OnDestroy {
  authorId: string;
  heroes = [];
  heroStatus = [];
  multipleHeroes = false;
  heroCounter = 0;
  controls = false;
  private subscriptions = new Subscriber();
  @Output() SliderInit = new EventEmitter<any>();

  @ViewChild(SwiperDirective) directiveRef?: SwiperDirective;

  config: SwiperConfigInterface = {
    init: false,
    direction: 'horizontal',
    // loop: true,
    slidesPerView: 1,
    // loopedSlides: 1,
    grabCursor: true,
    watchOverflow: true,
    spaceBetween: 26,
    initialSlide: 0,
    autoplay: {
      delay: 4500,
    },
    speed: 1000,
    keyboard: {
      enabled: true,
    },
    navigation: {
      nextEl: '.slider-arrow-right',
      prevEl: '.slider-arrow-left',
    },
  };

  constructor(
    private prhcApi: PrhcApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    // get content for homepage node preview
    if (window.location.pathname.split('/')[1] === 'node') {
      const nodeId = window.location.pathname.split('/')[3];
      this.prhcApi
        .getPreview('homepage', nodeId, 'field_hero')
        .subscribe(response => {
        if (
          response.article &&
          response.article['included'] &&
          response.article['included'].length
        ) {
            this.setHeroes(response.article);
        }
      });
    } else {
      this.subscriptions.add(
      this.prhcApi
        .getHomepageHero()
        .subscribe(response => {
          // for the real homepage
          if (
            response['included'] &&
            response['included'].length
          ) {
            this.setHeroes(response);
          }
       })
    );
    }
  }

  setHeroes(response) {
    const allHeroes = [];
    response['included'].map(paragraph => {
      if (paragraph.type === 'paragraph--homepage_hero') {
        this.heroCounter++;
        const hero = {
          title: paragraph.attributes.field_hero_title,
          subtitle: paragraph.attributes.field_hero_subtitle,
          video: paragraph.attributes.field_hero_video,
          imageUrl: undefined,
        };

        if (paragraph.relationships.field_hero_image.data) {
          // use original image. (for animated gif files)
          hero.imageUrl = paragraph.relationships.field_hero_image.data.meta.derivatives.large.url
            .replace('/styles/large/public', '');
          hero['imageAlt'] = paragraph.relationships.field_hero_image.data.meta.alt;
        }

        if (paragraph.attributes.field_hero_link) {
          hero['link'] = paragraph.attributes.field_hero_link;
        }
        allHeroes.push(hero);
      }
    });
    this.parseHeroes(allHeroes);
  }

  parseHeroes(allHeroes) {
    this.heroes = allHeroes;
    if (this.heroes.length >= 1
        && this.heroes.length === this.heroCounter) {
          this.heroes.map(currentHero => {
            // remove hero if it is not the only item
            if (currentHero.video && this.heroes.length > 1) {
              const index = this.heroes.indexOf(currentHero);
              this.heroes.splice(index, 1);
            } else if (currentHero.video && this.heroes.length <= 1) {
              // if only hero is video, display it with title below video
                this.controls = true;
                this.multipleHeroes = false;
            }
          });
          if (this.heroes.length > 1) {
            // display arrows if there is more than one
           this.multipleHeroes = true;
         }
        this.directiveRef.config.init = true;
    }
  }

  onClick(heroTitle) {
    this.tealium.track('link', {
      'module_type': 'Carousel',
      'module_variation': heroTitle,
    });
  }

  onHover(status) {
    if (status) {
      this.directiveRef.stopAutoplay();
    } else if (!status && this.heroes.length > 1) {
      this.directiveRef.startAutoplay();
    } else {
      this.directiveRef.stopAutoplay();
    }
  }

  isLoaded(heroStatus) {
    this.heroStatus.push(heroStatus);
    if (
      this.heroes.length > 1 &&
      this.heroStatus.length === this.heroes.length
    ) {
      this.directiveRef.config.loopedSlides = this.heroes.length;
      this.directiveRef.config.init = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
