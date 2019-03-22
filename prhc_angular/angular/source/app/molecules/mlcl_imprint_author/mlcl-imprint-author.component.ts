// import {
//   Component,
//   OnInit,
//   // Inject
// } from '@angular/core';
// // import { EnhancedApiService } from '../../services/enhanced_api.service';
// // import {
// //   getResponse,
// //   getRequestUrl,
// //   getCurrentContentInfo,
// // } from '../../services/enhanced_api.service';

// @Component({
//   selector: 'mlcl-imprint-author',
//   templateUrl: './mlcl-imprint-author.component.html',
// })
// export class MlclImprintAuthorComponent implements OnInit {
//   data = [];
//   isLoaded = false;
//   links = [];

//   // constructor(
//   //   @Inject(EnhancedApiService) protected enhanced: EnhancedApiService,
//   // ) {
//   //   this.enhanced.resetFilters();
//   // }

//   ngOnInit() {
//     // const url = getRequestUrl('authors');
//     // const currentContentInfo = getCurrentContentInfo();

//     // // set view all link
//     // const link = {
//     //   seoFriendlyUrl: window.location.pathname + '/authors',
//     //   label: 'View All',
//     //   classes: 'atm_alt-btn',
//     // };
//     // this.links.push(link);

//     // // set api filters
//     // this.enhanced.setFilter('imprintCode', currentContentInfo.id);
//     // this.enhanced.setFilter('rows', '8');
//     // this.enhanced.setFilter('contribRoleCode', 'A,I');
//     // this.enhanced.setFilter('sort', 'random');
//     // this.enhanced.setFilter('dir', 'asc');

//     // // call authors list endpoint
//     // const request = this.enhanced.request(url + '/list-display');

//     // // get results
//     // getResponse(request, response => {
//     //   if (response.data && response.data.length) {
//     //     response.data.forEach(item => {
//     //       this.data.push(parseData(item));
//     //     });

//     //     // set isLoaded flag
//     //     this.isLoaded = this.data.length > 0;
//     //   }
//     // });
//   }
// }

// /**
//  * preprocess work data before passing them to 'mlcl-slider-item'
//  */
// // export function parseData(author) {
// //   author.title = author.display;
// //   if (author.hasAuthorPhoto) {
// //     author.cover = author.photo;
// //   }
// //   return author;
// // }
