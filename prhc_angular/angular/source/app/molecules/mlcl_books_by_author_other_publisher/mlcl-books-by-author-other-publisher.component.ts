import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { setAuthorNames } from '../../services/enhanced_api.service';

@Component({
  selector: 'mlcl-books-by-author-other-publisher',
  templateUrl: './mlcl-books-by-author-other-publisher.component.html',
})
export class MlclBooksByAuthorOtherPublisherComponent implements OnInit {
  @Input() clientAuthor;
  works = [];
  isLoaded = false;
  heading: string;
  viewAllFlag = false;
  viewAllUrl: string;

  ngOnInit() {
    let companyName = '';
    let companyCode = '';
    // tslint:disable-next-line:forin
    for (const key in this.clientAuthor.company) {
      companyCode = key;
      companyName =  this.clientAuthor.company[companyCode];
    }

    // set slider heading
    this.heading = 'Books by ' + this.clientAuthor.display + ' from ' + companyName;

    // set view all link at the end of slider
    this.viewAllUrl =
      '/search?docType=work' +
      '&author=' +
      this.clientAuthor.authorId +
      '|' +
      this.clientAuthor.display +
      '&companyCode=' +
      companyCode;

    // set list of books by the author
    this.viewAllFlag = this.clientAuthor.works.length === 15;
    this.clientAuthor.works.map(setAuthorNames);
    this.isLoaded = true;
  }
}
