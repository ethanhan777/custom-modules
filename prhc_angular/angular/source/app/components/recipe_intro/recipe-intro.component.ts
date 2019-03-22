import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import {
  PrhcApiService,
  getRecipeIntro
} from '../../services/prhc_api.service';

export const recipeIntroSelector = 'recipe-intro';

@Component({
  selector: recipeIntroSelector,
  templateUrl: './recipe-intro.component.html',
})
@Injectable()
export class RecipeIntroComponent implements OnInit {
  recipeIntro: any;

  constructor (private prhcApi: PrhcApiService) {}

  ngOnInit() {
    this.prhcApi.getArticle('field_recipe_categories,field_units')
      .map(response => getRecipeIntro(response.article))
      .subscribe(response => {
        this.recipeIntro =  {
          subheading: response['subheading'],
          intro: response['intro'],
          yieldFrom: response['yieldFrom'],
          yieldTo: response['yieldTo'],
          yieldUnit: response['yieldUnit'],
          cookTime: response['cookTime'],
          prepTime: response['prepTime'],
          categories: response['categories'],
          relatedBook: response['relatedBook'],
        };
        if (response['yieldFrom'] === response['yieldTo']) {
          this.recipeIntro.yieldTo = undefined;
        }

      });
  }
}
