import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import {
  PrhcApiService,
} from '../../services/prhc_api.service';
import { accordionOpen } from '../../services/accordion.service';

export const recipeConclusionSelector = 'recipe-conclusion';

@Component({
  selector: recipeConclusionSelector,
  templateUrl: './recipe-conclusion.component.html',
})
@Injectable()
export class RecipeConclusionComponent implements OnInit {
  recipeConclusion: any;

  constructor (private prhcApi: PrhcApiService) {}

  ngOnInit() {
    this.prhcApi.getArticle('field_recipe_categories,field_units')
      // .map(response => getRecipeIntro(response.article))
      .subscribe(response => {
        response.article['data'].map(recipe => {
          this.recipeConclusion =  {
            conclusion: undefined,
            copyright: undefined,
          };

          if (recipe.attributes.field_conclusion) {
            this.recipeConclusion.conclusion = recipe.attributes.field_conclusion.processed;
          }
          if (recipe.attributes.field_copyright) {
            this.recipeConclusion.copyright = recipe.attributes.field_copyright.processed;
          }
          this.recipeConclusion.accordion = {
            toggle: false,
            chevron: 'chevron-down',
            heading: 'Copyright',
          };

          if (recipe.attributes.field_conclusion_subheading) {
            this.recipeConclusion.accordion.heading = recipe.attributes.field_conclusion_subheading;
          }
          this.recipeConclusion.accordion = {
            toggle: false,
            chevron: 'chevron-down',
            heading: 'Copyright',
          };

          if (recipe.attributes.field_conclusion_subheading) {
            this.recipeConclusion.accordion.heading = recipe.attributes.field_conclusion_subheading;
          }

          this.recipeConclusion.accordion = {
            toggle: false,
            chevron: 'chevron-down',
            heading: 'Copyright',
          };

          if (recipe.attributes.field_conclusion_subheading) {
            this.recipeConclusion.accordion.heading = recipe.attributes.field_conclusion_subheading;
          }

        });
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
