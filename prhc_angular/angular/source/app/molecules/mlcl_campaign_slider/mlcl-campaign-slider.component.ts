import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  EnhancedApiService,
  parseFeaturedBooks
} from '../../services/enhanced_api.service';
import {
  PrhcApiService,
  getCampaignSliderItems,
  getCoverFromIncluded
} from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';

@Component({
  selector: 'mlcl-campaign-slider',
  templateUrl: './mlcl-campaign-slider.component.html',
})
@Injectable()
export class MlclCampaignSliderComponent implements OnInit, OnDestroy {
  @Input() slider: any;
  @Input() type = 'slider';
  @Input() isSaveButton = false;
  @Output() savedBook = new EventEmitter<any>();
  heading = '';
  ids = [];
  sliderItems = [];
  isLoaded = false;
  private subscriptions = new Subscriber();

  constructor (
    private enhanced: EnhancedApiService,
    private prhcApi: PrhcApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    if (this.slider.attributes.field_subheading) {
      this.heading = this.slider.attributes.field_subheading;
    }

    this.subscriptions.add(
      this.prhcApi
        .getData(this.slider.relationships.field_content.links.related)
        .map(getCampaignSliderItems)
        .subscribe(response => {
          this.ids = response.ids;

          if (response.isbns.length) {
            this.getTitles(response.isbns);
          }

          if (response.authorIds.length) {
            this.getAuthors(response.authorIds);
          }

          if (response.nodes.length) {
            this.getDrupalNodes(response.nodes);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getTitles(isbns) {
    const zoom = [
      'https://api.penguinrandomhouse.com/title/authors/definition',
      'https://api.penguinrandomhouse.com/title/categories/definition',
      'https://api.penguinrandomhouse.com/title/titles/content/definition',
    ];

    const params = {
      zoom: zoom.join(','),
      catSetId: 'CN',
    };

    this.enhanced
      .getTitle(isbns, false, params)
      .map(parseFeaturedBooks)
      .subscribe(titles => {
        if (titles && titles.length) {
          titles.map(title => {
            this.sliderItems[this.ids.indexOf(title.isbn + '')] = title;
          });
        }

        if (
          this.sliderItems.length === this.ids.length &&
          !this.sliderItems.includes(undefined)
        ) {
          this.isLoaded = true;
        }
      });
  }

  getAuthors(authorIds) {
    this.enhanced
      .getAuthor(authorIds, 'list-display')
      .subscribe(response => {
        if (response['data'] && response['data'].length) {
          response['data'].map(author => {
            const slideItem = {
              title: author.display,
              seoFriendlyUrl: author.seoFriendlyUrl,
              cover: undefined,
            };

            if (author.hasAuthorPhoto) {
              slideItem.cover = author.photo;
            }
            this.sliderItems[this.ids.indexOf(author.authorId + '')] = slideItem;
          });
        }

        if (
          this.sliderItems.length === this.ids.length &&
          !this.sliderItems.includes(undefined)
        ) {
          this.isLoaded = true;
        }
      });
  }

  getDrupalNodes(nodes) {
    const groupedNodes = [];
    groupedNodes['article'] = [];
    groupedNodes['campaign'] = [];
    groupedNodes['recipe'] = [];
    nodes.map(node => {
      if (node.type === 'node--article') {
        groupedNodes['article'].push(node.id);
      } else if (node.type === 'node--campaign') {
        groupedNodes['campaign'].push(node.id);
      } else if (node.type === 'node--recipe') {
        groupedNodes['recipe'].push(node.id);
      }
    });

    // tslint:disable-next-line:forin
    for (const type in groupedNodes) {
      if (groupedNodes[type].length) {
        this.prhcApi
        .getNodes(type, groupedNodes[type])
        .subscribe(response => {
          if (response['data'] && response['data'].length) {
            response['data'].map(node => {
              if (node.attributes.status) {
                const slideItem = {
                  title: node.attributes.title,
                  seoFriendlyUrl: node.attributes.path
                  ? node.attributes.path.alias
                  : '/node/' + node.attributes.nid,
                  cover: getCoverFromIncluded(response['included'], node),
                };

                this.sliderItems[this.ids.indexOf(node.id + '')] = slideItem;
              } else {
                this.sliderItems[this.ids.indexOf(node.id + '')] = false;
              }
            });
          }

          if (
            this.sliderItems.length === this.ids.length &&
            !this.sliderItems.includes(undefined)
          ) {
            this.sliderItems = this.sliderItems.filter(item => item !== false);
            this.isLoaded = true;
          }
        });
      }
    }
  }

  onClick(title) {
    this.tealium.track('link', {
      'module_type': 'Campaign Slider',
      'module_variation': title,
    });
  }

  saveOnClick(status) {
    this.savedBook.emit(status);
  }
}
