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
//   selector: 'mlcl-grid-book-imprint',
//   templateUrl: '../mlcl_grid_book/mlcl-grid-book.component.html',
// })
// export class MlclGridBookImprintComponent implements OnInit {
//   enhanced;
//   filters;
//   start;
//   rows;
//   url;
//   setFilters;
//   isLoaded;
//   recordFlag;

//   ngOnInit() {
//     // this.sortFlag = this.sortFlag === false ? this.sortFlag : true;

//     // // set default sort options
//     // this.selectedOption = this.sortOptions[this.defaultSort];

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
//     //     response.data.forEach(work => {
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
//   //   // imprint
//   //   if (this.type === 'imprint') {
//   //     const currentPath = window.location.pathname.split('/');
//   //     const currentImprintCode = currentPath[2];
//   //     const nonAudioFormats = [];
//   //     const audioFormats = [];

//   //     work._embeds[0].titles.forEach(title => {
//   //       // separate format: non-audiobook and audiobook
//   //       if (title.imprint.code === currentImprintCode) {
//   //         if (
//   //           title.format.code !== 'CD' &&
//   //           title.format.code !== 'DN' &&
//   //           title.format.code !== 'CS'
//   //         ) {
//   //           nonAudioFormats.push(title);
//   //         } else {
//   //           audioFormats.push(title);
//   //         }
//   //       }
//   //     });

//   //     // apply the first non-audiobook format for cover and url.
//   //     if (nonAudioFormats.length) {
//   //       work.seoFriendlyUrl = nonAudioFormats[0].seoFriendlyUrl;
//   //       work.cover =
//   //         'https://images.randomhouse.com/cover/' + nonAudioFormats[0].isbn;
//   //     } else {
//   //       work.seoFriendlyUrl = audioFormats[0].seoFriendlyUrl;
//   //       work.cover =
//   //         'https://images.randomhouse.com/cover/' + audioFormats[0].isbn;
//   //     }
//   //   }

//   //   // parse author for rendering
//   //   if (work.author instanceof Array) {
//   //     const authors = [];
//   //     work.author.forEach(author => {
//   //       if (author.roleCode === 'A') {
//   //         authors.push(author.authorDisplay);
//   //       }
//   //     });
//   //     work.author = authors.join(', ');
//   //   }

//   //   return work;
//   // }
// }
