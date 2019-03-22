import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule, entryComponentSelectors } from './app/app.module';
import { environment } from './environments/environment';
import { bootstrapTopLevelComponents } from './dynamic-bootstrap-helpers';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(bootstrapTopLevelComponents(entryComponentSelectors))
  .catch(err => console.log(err));
