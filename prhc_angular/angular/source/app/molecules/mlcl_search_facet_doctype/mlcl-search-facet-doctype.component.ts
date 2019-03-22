import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'mlcl-search-facet-doctype',
  templateUrl: './mlcl-search-facet-doctype.component.html',
})
export class MlclSearchFacetDoctypeComponent implements OnInit {
  @Input() facet;
  @Input() params;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onFacet = new EventEmitter<any>();
  @Output() facetToRemove = new EventEmitter<any>();

  ngOnInit() {
    // switch work with isbn facet
    if (this.facet.values.work) {
      this.facet.values.isbn = this.facet.values.work;
    }
    delete this.facet.values.work;

    // remove currently selected doctype from facet
    if (this.params.docType) {
      delete this.facet.values[this.params.docType];
    }
  }

  filter(facetName, selectedFacet) {
    const params = {};
    params[facetName] = selectedFacet.split(' ').join('+');
    this.onFacet.emit(params);
  }

  removeFacet(facetKey) {
    this.facetToRemove.emit(facetKey);
  }
}
