// import {
//   Component,
//   OnInit,
//   Injectable
// } from '@angular/core';
// import { EnhancedApiService } from '../../services/enhanced_api.service';

// export const comingSoonNextMonthSelector = 'coming-soon-next-month';

// @Component({
//   selector: comingSoonNextMonthSelector,
//   templateUrl: './coming-soon-next-month.component.html',
// })
// @Injectable()
// export class ComingSoonNextMonthComponent implements OnInit {
//   data = [];
//   isLoaded = false;
//   loading = false;
//   loadMoreFlag = false;
//   private rows = 32;
//   private options = {
//     sort: { name: 'onsale', dir: 'asc' },
//     next: 0,
//   };

//   constructor( private enhanced: EnhancedApiService ) {}

//   ngOnInit() {
//     // set filters for child component
//     const request = this.enhanced.getComingSoon('next-month');
//     this.subscribeRequest(request);
//   }

//   sort(sortOption) {
//     this.loading = true;
//     this.data = [];
//     this.options.sort = sortOption;
//     this.options.next = 0;

//     const request = this.enhanced.getComingSoon('next-month', this.options);
//     this.subscribeRequest(request);
//   }

//   loadMore() {
//     this.loadMoreFlag = false;
//     this.loading = true;
//     this.options.next = this.options.next + this.rows;

//     const request = this.enhanced.getComingSoon('next-month', this.options);
//     this.subscribeRequest(request);
//   }

//   subscribeRequest(request) {
//     request.subscribe(response => {
//       if (response.data && response.data.length) {
//         response.data.map(work => {
//           this.data.push(work);
//         });

//         if (response.recordCount > this.data.length) {
//           this.loadMoreFlag = true;
//         }
//       }

//       this.isLoaded = this.data.length > 0;
//       this.loading = false;
//     });
//   }
// }
