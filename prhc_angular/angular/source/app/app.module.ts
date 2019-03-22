import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  AppComponent,
  appComponentSelector
} from './app.component';
import { ServicesModule } from './services/services.module';
import { AtomsModule } from './atoms/atoms.module';
import { MoleculesModule } from './molecules/molecules.module';
import {
  componentSelectors,
  ComponentsModule,
} from './components/components.module';
import {
  pageSelectors,
  PagesModule,
} from './pages/pages.module';

export const entryComponentSelectors = [
  ...componentSelectors,
  ...pageSelectors,
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ServicesModule,
    AtomsModule,
    MoleculesModule,
    ComponentsModule,
    PagesModule,
  ],
  providers: [
    { provide: appComponentSelector, useValue: AppComponent },
  ],
  entryComponents: [AppComponent],
})
export class AppModule {
  ngDoBootstrap() {}
}
