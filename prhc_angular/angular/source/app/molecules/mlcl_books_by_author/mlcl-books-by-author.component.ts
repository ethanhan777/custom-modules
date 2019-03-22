import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'mlcl-books-by-author',
  templateUrl: './mlcl-books-by-author.component.html',
})
export class MlclBooksByAuthorComponent implements OnInit {
  @Input() works = [];

  ngOnInit() {
    // if (this.works.length) {
    //   this.works.map(parseAuthorDisplayWorks);
    // }
    // if (this.authorName) {
    //   this.authorName = 'Books by ' + this.authorName;
    // }

    // const url = this.enhancedApiService.getRequestUrl();

    // // set filters
    // this.enhancedApiService.resetFilters();
    // this.enhancedApiService.setFilter('contribRoleCode', 'A,I');
    // this.enhancedApiService.setFilter('sort', 'onsale');
    // this.enhancedApiService.setFilter('dir', 'desc');
    // this.enhancedApiService.setFilter('rows', '0');

    // // call authorWorks endpoint
    // this.enhancedApiService.mapData(url + '/works');

    // // get results
    // this.enhancedApiService.getResponse(data => {
    //   if (data && data.length) {
    //     data.map(work => {
    //       this.data.push(work);
    //     });

    //     // set isLoaded flag
    //     this.isContentLoaded();
    //   }
    // });
  }
}
