import {
  Component,
  Injectable,
  OnInit
} from '@angular/core';
import {
  PrhcApiService,
  parseArticles,
} from '../../services/prhc_api.service';

export const recipeListSelector = 'recipe-list';

@Component({
  selector: recipeListSelector,
  templateUrl: './recipe-list.component.html',
})
@Injectable()
export class RecipeListComponent implements OnInit {
  recipes = [];
  start = 0;
  rows = 32;
  loading = false;
  isLoaded = false;
  loadMoreFlag = false;
  noContent = false;

  constructor (private prhcApi: PrhcApiService) {}

  ngOnInit() {
    this.prhcApi.getRecipes()
      .map(parseArticles)
      .subscribe(response => {
        if (!response.articles.length) {
          this.noContent = true;
          this.isLoaded = true;
        } else {
            response.articles.map(article => {
              article.articleBody = article.metaDescription;
              article.label = undefined;
              this.recipes.push(article);
            });
          this.loadMoreFlag = response.loadMoreFlag;
          this.isLoaded = true;
        }
      });
  }

  /**
   * load more api data
   *
   * @param {rows}
   */
  loadMore() {
    this.loading = true;
    this.start += this.rows;

    this.prhcApi.getRecipes({
      next: this.start,
      rows: this.rows,
    })
      .map(parseArticles)
      .subscribe(response => {
        response.articles.map(article => {
          this.recipes.push(article);
        });
        this.loadMoreFlag = response.loadMoreFlag;
        this.loading = false;
      });
  }

  // getArticle() {


  //   // get results
  //   this.prhcApiService.getResponse(data => {
  //     if (data.data && data.data.length) {
  //       data.data.forEach(article => {
  //         this.addData(article, data.included);
  //       });

  //       if (data.links.next) {
  //         this.loadMoreFlag = true;
  //       }
  //     }

  //     if (this.data && this.data.length) {
  //       this.isLoaded = true;
  //     }
  //   });
  // }

  // addData(article, included) {
  //   const articleItem = new Article();
  //   articleItem.title = article.attributes.title;
  //   // articleItem.subtitle = article.attributes.field_subtitle;
  //   if (article.attributes.path) {
  //     articleItem.seoFriendlyUrl = article.attributes.path.alias;
  //   } else {
  //     articleItem.seoFriendlyUrl = '/node/' + article.attributes.nid;
  //   }

  //   if (article.attributes.field_meta_description) {
  //     articleItem.body = article.attributes.field_meta_description;
  //   }

  //   // thumbnail image
  //   if (article.relationships.field_meta_image.data) {
  //     articleItem.cover = this.getImage(
  //       article.relationships.field_meta_image.data.id,
  //       included,
  //     );
  //   } else if (article.relationships.field_image.data) {
  //     articleItem.cover = this.getImage(
  //       article.relationships.field_image.data.id,
  //       included,
  //     );
  //   }

  //   // category
  //   // if (article.relationships.field_recipe_categories.data) {
  //   //   article.relationships.field_recipe_categories.data.forEach((cat) => {
  //   //     articleItem.categories.push(this.getTaxonomyTerm(cat.id, included));
  //   //   });
  //   // }

  //   // category tags for recipes
  //   if (article.relationships.field_recipe_categories.data) {
  //     article.relationships.field_recipe_categories.data.forEach(cat => {
  //       if (articleItem.tags.length < 5) {
  //         articleItem.tags.push(this.getTaxonomyTerm(cat.id, included));
  //       }
  //     });
  //   }

  //   this.data.push(articleItem);
  // }
}
