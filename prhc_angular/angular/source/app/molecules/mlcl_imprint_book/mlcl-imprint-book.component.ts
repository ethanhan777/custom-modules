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
// // import {
// //   getCalculatedDateByDay,
// //   formatDate,
// // } from '../../services/date_format.service';
// // import { setFrontlistestWork } from '../../components/new_release_imprint/component';

// @Component({
//   selector: 'mlcl-imprint-book',
//   templateUrl: './mlcl-imprint-book.component.html',
// })
// export class MlclImprintBookComponent implements OnInit {
//   data = [];
//   isLoaded = false;
//   links = [];

//   // constructor(
//   //   @Inject(EnhancedApiService) protected enhanced: EnhancedApiService,
//   // ) {
//   //   this.enhanced.resetFilters();
//   // }

//   ngOnInit() {
//     // const url = getRequestUrl('works');
//     // const currentContentInfo = getCurrentContentInfo();

//     // // set view all link
//     // const link = {
//     //   seoFriendlyUrl: window.location.pathname + '/books',
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
//     // this.enhanced.setFilter('onSaleTo', getCalculatedDateByDay(-180));
//     // this.enhanced.setFilter('sort', 'award');
//     // this.enhanced.setFilter(
//     //   'zoom',
//     //   'https://api.penguinrandomhouse.com/title/titles/definition',
//     // );
//     // this.enhanced.setFilter('showNewReleases', 'false');
//     // this.enhanced.setFilter('showComingSoon', 'false');

//     // // call authors list endpoint
//     // const request = this.enhanced.request(url);

//     // // get results
//     // getResponse(request, response => {
//     //   if (response.data && response.data.length) {
//     //     response.data.forEach(item => {
//     //       this.data.push(setFrontlistestWork(item, currentContentInfo.id));
//     //     });

//     //     // set isLoaded flag
//     //     this.isLoaded = this.data.length > 0;
//     //   }
//     // });
//   }
// }
