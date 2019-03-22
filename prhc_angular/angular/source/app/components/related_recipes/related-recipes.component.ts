import {
  Component,
  OnInit,
  Injectable,
  Input,
  OnDestroy
} from '@angular/core';
import {
  EnhancedApiService,
  getCurrentContentInfo
} from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const relatedRecipesSelector = 'related-recipes';

@Component({
  selector: relatedRecipesSelector,
  templateUrl: './related-recipes.component.html',
})
@Injectable()
export class RelatedRecipesComponent implements OnInit, OnDestroy {
  @Input() isbn: string;
  @Input() title = 'Recipes';
  @Input() excludeNid: string;

  data = [];
  isLoaded = false;
  viewAllFlag = false;
  viewAllUrl: string;
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    if (!this.isbn) {
      this.isbn = getCurrentContentInfo().isbn;
    }

    if (this.isbn && this.isbn.length === 13) {
      this.subscriptions.add (
        this.enhanced
        .getRelatedRecipes(this.isbn, this.excludeNid)
        .subscribe(response => {
          if (response && response.length) {
            this.data = response;
            // response.map((recipe) => {
            //   this.data.push(recipe);
            // });

            if (this.data && this.data.length) {
              this.isLoaded = true;
            }
            this.viewAllUrl = '/recipes';
            this.viewAllFlag = this.data.length === 15;
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
