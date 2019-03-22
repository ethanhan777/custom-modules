import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';

import {
  PrhcApiService,
  getRecipeDirections,
} from '../../services/prhc_api.service';
import { accordionOpen } from '../../services/accordion.service';

export const recipeDirectionsSelector = 'recipe-directions';

@Component({
  selector: recipeDirectionsSelector,
  templateUrl: '../recipe_ingredients/recipe-ingredients.component.html',
})
@Injectable()
export class RecipeDirectionsComponent implements OnInit {
  accordion: any;
  ingredientComponents = [];
  isLoaded = false;

  constructor (private prhcApi: PrhcApiService) {}

  ngOnInit() {
    this.accordion = {
      id: 'directions',
      heading: 'Directions',
      toggle: true,
      chevron: 'chevron-up',
    };

    this.prhcApi.getArticle('field_steps')
      .map(response => getRecipeDirections(response.article, 'field_steps'))
      .subscribe(response => {
        this.ingredientComponents = response['components'];
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
