import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';

@Component({
  selector: 'mlcl-search-facet-date',
  templateUrl: './mlcl-search-facet-date.component.html',
})
export class MlclSearchFacetDateComponent implements OnInit {
  @Input() dateFacets;
  @Input() facet;
  @Input() params;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onFacet = new EventEmitter<any>();
  @Output() facetToRemove = new EventEmitter<any>();

  values = {
    comingSoon: 0,
    newRelease: 0,
  };
  renderFlag = true;

  accordion: any;
  valueCount: number;

  ngOnInit() {
    this.dateFacets.forEach((facet) => {
      if (facet.values.true) {
        this.values[facet.name] = facet.values.true;
      }
    });

    this.accordion = {
      id: 'release-date',
      heading: 'Release Date',
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
