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

export const recipeTipsSelector = 'recipe-tips';

@Component({
  selector: recipeTipsSelector,
  templateUrl: '../recipe_ingredients/recipe-ingredients.component.html',
})
@Injectable()
export class RecipeTipsComponent implements OnInit {
  accordion: any;
  ingredientComponents = [];
  isLoaded = false;

  constructor (private prhcApi: PrhcApiService) {}

  ngOnInit() {
    this.accordion = {
      id: 'tips',
      heading: 'Tips',
      toggle: true,
      chevron: 'chevron-up',
    };

    this.prhcApi.getArticle('field_tips')
      .map(response => getRecipeDirections(response.article, 'field_tips'))
      .subscribe(response => {
        if (response['components'][0].field_tips) {
          this.ingredientComponents = response['components'];
          this.isLoaded = true;
        }
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

  // private includes = 'field_tips';
  // private accordionId = 'tips';
  // private accordionHeading = 'Tips';

  // getContent(content, included) {
  //   // stpe items
  //   if (content.relationships.field_tips.data) {
  //     content.relationships.field_tips.data.forEach(item => {
  //       const tip = this.getTaxonomyTerm(item.id, included);

  //       if (tip.field_tips) {
  //         const regexIcon = /<i.*?><\/i>/g;
  //         this.listField = tip.field_tips.value.replace(regexIcon, '');

  //         if (item.type == 'paragraph--inline_image') {
  //           included.forEach(included => {
  //             if (included.id == item.id) {
  //               tip.relationships = included.relationships;
  //             }
  //           });
  //         }

  //         if (tip.field_inline_video) {
  //           tip.embed = convertYoutubeVideo(tip.field_inline_video);
  //         }

  //         this.data.push(tip);
  //       }
  //     });
  //   }
  // }
}
