import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AtomsModule } from '../atoms/atoms.module';
import { MoleculesModule } from '../molecules/molecules.module';
import { ComponentsModule } from '../components/components.module';
import { ServicesModule } from '../services/services.module';
import { SharedModule } from '../shared/shared.module';

import {
  BookComponent,
  bookSelector,
} from './book/book-page.component';
import {
  BookExceprtPageComponent,
  bookExcerptPageSelector,
} from './book_excerpt/book-excerpt-page.component';
import {
  QuizComponent,
  quizSelector,
} from './quiz/quiz-page.component';
import {
  SavedBooksComponent,
  savedBooksSelector,
} from './saved_books/saved-books-page.component';
import {
  AuthorPageComponent,
  authorPageSelector,
} from './author/author-page.component';
import {
  AuthorEventsPageComponent,
  authorEventsPageSelector,
} from './author_events/author-events-page.component';
import {
  HomePageComponent,
  homePageSelector,
} from './home/home-page.component';
import {
  SeriesPageComponent,
  seriesPageSelector,
} from './series/series-page.component';
import {
  EventPageComponent,
  eventPageSelector,
} from './event/event-page.component';
import {
  EventLocationPageComponent,
  eventLocationPageSelector,
} from './event_location/event-location-page.component';
import {
  ImprintPageComponent,
  imprintPageSelector,
} from './imprint/imprint-page.component';
import {
  CategoryPageComponent,
  categoryPageSelector,
} from './category/category-page.component';
import {
  LandingPageComponent,
  landingPageSelector,
} from './landing/landing-page.component';
import {
  LandingDrupalPageComponent,
  landingDrupalPageSelector,
} from './landing_drupal/landing-drupal-page.component';
import {
  NodeCampaignPageComponent,
  nodeCampaignPageSelector,
} from './node_campaign/node-campaign-page.component';
import {
  NodeRecipePageComponent,
  nodeRecipePageSelector,
} from './node_recipe/node-recipe-page.component';
import {
  NodeArticlePageComponent,
  nodeArticlePageSelector,
} from './node_article/node-article-page.component';


export const pageSelectors = [
  bookSelector,
  bookExcerptPageSelector,
  quizSelector,
  savedBooksSelector,
  authorPageSelector,
  authorEventsPageSelector,
  homePageSelector,
  seriesPageSelector,
  eventPageSelector,
  eventLocationPageSelector,
  imprintPageSelector,
  categoryPageSelector,
  landingPageSelector,
  landingDrupalPageSelector,
  nodeCampaignPageSelector,
  nodeRecipePageSelector,
  nodeArticlePageSelector,
];

const declarations = [
  BookComponent,
  BookExceprtPageComponent,
  QuizComponent,
  SavedBooksComponent,
  AuthorPageComponent,
  AuthorEventsPageComponent,
  HomePageComponent,
  SeriesPageComponent,
  EventPageComponent,
  EventLocationPageComponent,
  ImprintPageComponent,
  CategoryPageComponent,
  LandingPageComponent,
  LandingDrupalPageComponent,
  NodeCampaignPageComponent,
  NodeRecipePageComponent,
  NodeArticlePageComponent,
];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AtomsModule,
    MoleculesModule,
    ComponentsModule,
    SharedModule,
    ServicesModule,
  ],
  exports: [...declarations],
  entryComponents: [...declarations],
  declarations,
  providers: [
    { provide: bookSelector, useValue: BookComponent },
    { provide: bookExcerptPageSelector, useValue: BookExceprtPageComponent },
    { provide: quizSelector, useValue: QuizComponent },
    { provide: savedBooksSelector, useValue: SavedBooksComponent },
    { provide: authorPageSelector, useValue: AuthorPageComponent },
    { provide: authorEventsPageSelector, useValue: AuthorEventsPageComponent },
    { provide: homePageSelector, useValue: HomePageComponent },
    { provide: seriesPageSelector, useValue: SeriesPageComponent },
    { provide: eventPageSelector, useValue: EventPageComponent },
    { provide: eventLocationPageSelector, useValue: EventLocationPageComponent },
    { provide: imprintPageSelector, useValue: ImprintPageComponent },
    { provide: categoryPageSelector, useValue: CategoryPageComponent },
    { provide: landingPageSelector, useValue: LandingPageComponent },
    { provide: landingDrupalPageSelector, useValue: LandingDrupalPageComponent },
    { provide: nodeCampaignPageSelector, useValue: NodeCampaignPageComponent },
    { provide: nodeRecipePageSelector, useValue: NodeRecipePageComponent },
    { provide: nodeArticlePageSelector, useValue: NodeArticlePageComponent },
  ],
})
export class PagesModule {}
