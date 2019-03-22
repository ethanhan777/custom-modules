import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';

import {
  PrhcApiService,
  getRecipeIngredients,
} from '../../services/prhc_api.service';
import { accordionOpen } from '../../services/accordion.service';

export const recipeIngredientsSelector = 'recipe-ingredients';

@Component({
  selector: recipeIngredientsSelector,
  templateUrl: './recipe-ingredients.component.html',
})
@Injectable()
export class RecipeIngredientsComponent implements OnInit {
  accordion: any;
  ingredientComponents = [];
  ingredientTags = [];
  isLoaded = false;

  constructor (private prhcApi: PrhcApiService) {}

  ngOnInit() {
    this.accordion = {
      id: 'ingredients',
      heading: 'Ingredients',
      toggle: true,
      chevron: 'chevron-up',
    };

    this.prhcApi.getArticle('field_ingredients,field_ingredient_tags')
      .map(response => getRecipeIngredients(response.article))
      .subscribe(response => {
        this.ingredientComponents = response['components'];
        this.ingredientTags = response['tags'];
        this.isLoaded = true;
      });
  }

  /**
   * Toggle the accordion on click
   *
   * @param {$event} accordion header click event.
   * @param {accordion} Accordion interface object.
   */
  accordionOpen(accordion) {
    accordionOpen(accordion);
  }
}
