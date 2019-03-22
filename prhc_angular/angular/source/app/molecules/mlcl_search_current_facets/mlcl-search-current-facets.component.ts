import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'mlcl-search-current-facets',
  templateUrl: './mlcl-search-current-facets.component.html',
})
export class MlclSearchCurrentFacetsComponent implements OnInit {
  @Input() currentFacets;
  @Output() facetToRemove = new EventEmitter<any>();

  ngOnInit() {
    const facetKeys = Object.keys(this.currentFacets);
    facetKeys.forEach((key) => {
      this.currentFacets[key] = this.currentFacets[key].split('+').join(' ');
    });
  }

  removeFacet(facetKey) {
    this.facetToRemove.emit(facetKey);
  }
}
