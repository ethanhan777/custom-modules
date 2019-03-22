// import {
//   Component,
//   OnInit,
//   Input,
//   Output,
//   EventEmitter,
//   // Inject,
// } from '@angular/core';
// // import { EnhancedApiService } from '../../services/enhanced_api.service';
// // import {
// //   getResponse,
// //   getCurrentContentInfo,
// //   getRequestUrl,
// // } from '../../services/enhanced_api.service';
// // import { MlclSlider } from '../../molecules/mlcl_slider/component';
// // import { EnhancedApiBase } from '../../shared/enhanced_base.component';

// @Component({
//   selector: 'mlcl-series-by-category',
//   templateUrl: './mlcl-series-by-category.component.html',
// })
// export class MlclSeriesByCategoryComponent implements OnInit {
//   @Input() category;
//   @Input() ignoreSeriesCode;
//   // tslint:disable-next-line:no-output-on-prefix
//   @Output() onSliderInit = new EventEmitter<any>();
//   data = [];
//   isLoaded = false;
//   title = 'Series in ';

//   // constructor(
//   //   @Inject(EnhancedApiService) protected enhanced: EnhancedApiService,
//   // ) {
//   //   super(enhanced);
//   //   this.enhanced.resetFilters();
//   // }

//   ngOnInit() {
//     this.title +=
//       '<a href="/categories/' +
//       this.category.catId +
//       this.category.catUri +
//       '" class="atm_tag">' +
//       this.category.description +
//       '</a>';

//     // generate api url
//     // const url = getRequestUrl('categories', this.category.catId);

//     // // set filters
//     // this.enhanced.resetFilters();
//     // this.enhanced.setFilter('suppressLinks', 'true');
//     // this.enhanced.setFilter('returnEmptyLists', 'true');
//     // this.enhanced.setFilter('rows', '15');
//     // if (this.ignoreSeriesCode) {
//     //   this.enhanced.setFilter('ignoreSeries', this.ignoreSeriesCode);
//     // }
//     // this.enhanced.setFilter('sort', 'seriesDate');
//     // this.enhanced.setFilter('dir', 'desc');

//     // // call categroySeries endpoint
//     // const request = this.enhanced.request(url + '/series');

//     // // get results
//     // getResponse(request, response => {
//     //   if (response.data && response.data.length) {
//     //     response.data.forEach(set => {
//     //       set.title = set.seriesName;
//     //       set.code = set.seriesCode;
//     //       this.data.push(set);
//     //     });

//     //     this.isLoaded = this.data.length > 0;
//     //   } else {
//     //     this.onSliderInit.emit(false);
//     //   }
//     // });
//   }

//   /**
//    * send parent component if slide is ready to be inited.
//    */
//   // initSlider($event) {
//   //   this.onSliderInit.emit($event);
//   // }
// }
