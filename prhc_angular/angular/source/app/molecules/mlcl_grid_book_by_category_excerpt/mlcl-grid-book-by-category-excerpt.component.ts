// import {
//   Component,
//   OnInit
// } from '@angular/core';
// // import { MlclGridBookCategoryComponent } from '../mlcl_grid_book_by_category/mlcl-grid-book-by-category.component';
// // import {
// //   getResponse,
// //   getCurrentContentInfo,
// // } from '../../services/enhanced_api.service';

// @Component({
//   selector: 'mlcl-grid-book-excerpt',
//   templateUrl: '../mlcl_grid_book/mlcl-grid-book.component.html',
// })
// export class MlclGridBookExcerptComponent implements OnInit {
//   ngOnInit() {
//     // const currentContentInfo = getCurrentContentInfo();

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
//     //       this.data.push(this.parseData(work, currentContentInfo.id));
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
//   // parseData(work, catId?) {
//   //   // excpert by category landing page
//   //   if (this.type === 'excerpts') {
//   //     // audiobook category
//   //     if (catId && catId === '2000000169') {
//   //       const audioFormat = this.getAudioFormat(work);
//   //       if (audioFormat) {
//   //         work.seoFriendlyUrl = audioFormat.seoFriendlyUrl;
//   //         work.cover =
//   //           'https://images.randomhouse.com/cover/' + audioFormat.isbn;
//   //       }
//   //     }
//   //     work.label = 'Exceprt';
//   //     work.seoFriendlyUrl += '/excerpt';
//   //   }

//   //   // bookclub by category landing page
//   //   if (this.type === 'book-clubs') {
//   //     // audiobook category
//   //     if (catId && catId === '2000000169') {
//   //       const audioFormat = this.getAudioFormat(work);
//   //       if (audioFormat) {
//   //         work.seoFriendlyUrl = audioFormat.seoFriendlyUrl;
//   //         work.cover =
//   //           'https://images.randomhouse.com/cover/' + audioFormat.isbn;
//   //       }
//   //     }

//   //     work.label = 'Reading Guide';
//   //     work.seoFriendlyUrl += '/reading-guide';
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
