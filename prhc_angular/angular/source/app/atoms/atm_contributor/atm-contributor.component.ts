import {
  Component,
  Input
} from '@angular/core';
// import { EnhancedApiService } from '../../services/enhanced_api.service';

@Component({
  selector: 'atm-contributor',
  templateUrl: './atm-contributor.component.html',
})
export class AtmContributorComponent {
  @Input() contributors = [];
  @Input() byRoleName = 'by ';
  // @Input() contributorId;
  // isLoaded = false;

  // constructor(
  //   @Inject(EnhancedApiService) private enhanced: EnhancedApiService
  // ) {}

  // ngOnInit() {
    // if (this.contributorId) {
    //   // call api
    //   const request = this.enhanced.getAuthor(this.contributorId);

    //   request.subscribe(response => {
    //     if (response.data && response.data.length) {
    //       response.data.map((author) => {
    //         this.contributors.push(author);
    //       });

    //       this.isLoaded = this.contributors.length > 0;
    //     }
    //   });
    // }

    // this.isLoaded = this.contributors.length > 0;
  // }
}
