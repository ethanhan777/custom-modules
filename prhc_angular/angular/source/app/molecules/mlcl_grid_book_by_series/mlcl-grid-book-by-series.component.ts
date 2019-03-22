// import {
//   Component,
//   OnInit,
//   // Input,
//   // Output,
//   // EventEmitter
// } from '@angular/core';
// // import { MlclGridBookComponent } from '../mlcl_grid_book/mlcl-grid-book.component';
// // import {
// //   getResponse,
// //   getCurrentContentInfo,
// // } from '../../services/enhanced_api.service';

// @Component({
//   selector: 'mlcl-grid-book-series',
//   templateUrl: '../mlcl_grid_book/mlcl-grid-book.component.html',
// })
// export class MlclGridBookSeriesComponent implements OnInit {
//   enhanced;
//   filters;
//   setFilters;
//   start;
//   rows;
//   url;
//   isLoaded;
//   recordFlag;

//   seriesSortOptions = [
//     { name: 'seriesNumber', dir: 'desc', desc: 'Last to First' },
//     { name: 'seriesNumber', dir: 'asc', desc: 'First to Last' },
//   ];
//   selectedSeriesOption: any;

//   ngOnInit() {
//     // this.sortFlag = this.sortFlag === false ? this.sortFlag : true;

//     // // set default sort options
//     // this.selectedOption = this.sortOptions[this.defaultSort];
//     // this.selectedSeriesOption = this.seriesSortOptions[0];

//     // // set api filters
//     // this.enhanced.resetFilters();
//     // if (this.filters) {
//     //   this.setFilters(this.filters, true);
//     // }
//     // this.enhanced.setFilter('start', this.start);
//     // this.enhanced.setFilter('rows', this.rows);

//     // // map the data from http call
//     // const request = this.enhanced.request(this.url);

//     // // get results
//     // getResponse(request, response => {
//     //   if (response.data && response.data.length) {
//     //     response.data.map(work => {
//     //       this.data.push(this.parseData(work));
//     //     });

//     //     // set isLoaded flag
//     //     this.isLoaded = this.data.length > 0;
//     //     this.recordFlag.emit(true);

//     //     if (response.recordCount > this.data.length) {
//     //       this.loadMoreFlag = true;
//     //     }
//     //   } else {
//     //     this.recordFlag.emit(false);
//     //   }
//     // });
//   }

//   /**
//    * preprocess work data before passing them to 'mlcl-slider-item'
//    */
//   // parseData(work) {
//   //   // set label for book with series number
//   //   if (this.type === 'series' && work.seriesNumber) {
//   //     work.label = 'Book ' + work.seriesNumber;
//   //   }

//   //   // parse author for rendering
//   //   if (work.author instanceof Array) {
//   //     const authors = [];
//   //     work.author.map(author => {
//   //       if (author.roleCode === 'A') {
//   //         authors.push(author.authorDisplay);
//   //       }
//   //     });
//   //     work.author = authors.join(', ');
//   //   }

//   //   return work;
//   // }
// }
