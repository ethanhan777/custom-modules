// import {
//   Component,
//   OnInit,
//   Input
// } from '@angular/core';
// // import { EnhancedApiBase } from '../../shared/enhanced_base.component';

// @Component({
//   selector: 'mlcl-category-breadcrumb',
//   templateUrl: './mlcl-category-breadcrumb.component.html',
// })
// export class MlclCategoryBreadcrumbComponent implements OnInit {
//   @Input() catId: string;

//   ngOnInit() {
//     // this.getCategoryHierarchy(this.catId);
//   }

//   /**
//    * get current category and its parent category if exsit.
//    *
//    * @param {catId} category id.
//    */
//   // getCategoryHierarchy(catId) {
//   //   const url = '/api/enhanced/categories/hierarchy';

//   //   // set filter
//   //   this.enhancedApiService.resetFilters();
//   //   this.enhancedApiService.setFilter('catId', catId);
//   //   this.enhancedApiService.setFilter('catSetId', 'CN');

//   //   // call categoryHierarchy endpoint
//   //   this.enhancedApiService.mapData(url);

//   //   // get results
//   //   this.enhancedApiService.getResponse(data => {
//   //     if (data && data.length) {
//   //       data.forEach(category => {
//   //         category.name = category.catDesc;
//   //         category.seoFriendlyUrl =
//   //           '/categories/' + category.catId + category.catUri;
//   //         this.data.push(category);

//   //         // stop recursion when it reaches to the root category
//   //         if (category.parent && category.parent.catId !== 2000000000) {
//   //           this.getCategoryHierarchy(category.parent.catId);
//   //         } else {
//   //           this.data.reverse();
//   //         }
//   //       });
//   //     }
//   //   });
//   // }
// }
