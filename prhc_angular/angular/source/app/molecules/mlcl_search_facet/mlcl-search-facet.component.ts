import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';

@Component({
  selector: 'mlcl-search-facet',
  templateUrl: './mlcl-search-facet.component.html',
})
export class MlclSearchFacetComponent implements OnInit {
  @Input() facet;
  @Input() params;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onFacet = new EventEmitter<any>();
  @Output() facetToRemove = new EventEmitter<any>();
  accordion: any;
  valueCount: number;
  showAllFlag = false;

  ngOnInit() {
    let label = '';
    switch (this.facet.name) {
      case 'categoryLabel':
        label = 'Category';
        break;

      case 'ageRange':
        label = 'Age Range';
        break;

      case 'eventCityState':
        label = 'Event Location';
        break;

      default:
        // capitalize the labels.
        label = this.facet.name.charAt(0).toUpperCase() + this.facet.name.slice(1);
        break;
    }

    this.valueCount = Object.keys(this.facet.values).length;

    this.accordion = {
      id: this.facet.name,
      heading: label,
      toggle: true,
      chevron: 'chevron-up'
    };
  }

  filter(facetName, selectedFacet) {
    const params = {};
    params[facetName] = selectedFacet.split(' ').join('+');
    this.onFacet.emit(params);
  }

  removeFacet(facetKey) {
    this.facetToRemove.emit(facetKey);
  }

  /**
   * Toggle the accordion on click
   *
   * @param {$event} accordion header click event.
   * @param {accordion} Accordion interface object.
   */
  accordionOpen(accordion) {
    accordionOpen(accordion);
  }
}
