import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import { EnhancedApiService } from '../../services/enhanced_api.service';

export const aboutAuthorInSeriesSelector = 'about-author-in-series';

@Component({
  selector: aboutAuthorInSeriesSelector,
  templateUrl: 'about-author-in-series.component.html',
})
@Injectable()
export class AboutAuthorInSeriesComponent implements OnInit {
  authors = [];
  isNumbered = false;
  constructor (private enhanced: EnhancedApiService) {}

  ngOnInit() {
    this.enhanced.getSeriesAuthors()
      .subscribe(response => {
        if (response.series && response.series['data']) {
          this.isNumbered = response.series['data'][0].isNumbered;
        }

        if (
          response.authors &&
          response.authors['recordCount'] <= 3 &&
          response.authors['data']
        ) {
          response.authors['data'].map(author => {
            if (author._embeds) {
              author._embeds.map(embed => {
                if (embed.content) {
                  author.spotlight = embed.content.spotlight;
                }
              });
            }
            this.authors.push(author);
          });
        }
      });
  }
}
