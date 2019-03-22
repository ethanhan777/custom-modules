import {
  Component,
  OnInit,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { TealiumUtagService } from '../../services/utag.service';
import { PrhcApiService } from '../../services/prhc_api.service';

export const nodeRecipePageSelector = 'node-recipe-page';

@Component({
  selector: nodeRecipePageSelector,
  templateUrl: './node-recipe-page.component.html',
})
@Injectable()
export class NodeRecipePageComponent implements OnInit, OnDestroy {
  recipe: any;
  private subscriptions = new Subscriber();

  constructor(
    private prhcApi: PrhcApiService,
    private tealium: TealiumUtagService,
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.prhcApi.getArticle()
        .subscribe(response => {
          if (response.nodeInfo && response.nodeInfo) {
            this.recipe = response.nodeInfo;
            this.sendTealiumData(this.recipe);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendTealiumData(recipe) {
    const utagData = {
      'page_type': 'recipe',
      'page_name': recipe['data'].name,
    };

    this.tealium.track('view', utagData);
  }
}
