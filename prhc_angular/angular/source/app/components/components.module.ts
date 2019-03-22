import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';

import { AtomsModule } from '../atoms/atoms.module';
import { MoleculesModule } from '../molecules/molecules.module';
import { ServicesModule } from '../services/services.module';
import { SharedModule } from '../shared/shared.module';

import {
  AboutAuthorAccordionComponent,
  aboutAuthorAccordionSelector,
} from './about_author_accordion/about-author-accordion.component';
import {
  AboutAuthorAccordionArticleComponent,
  aboutAuthorAccordionArticleSelector,
} from './about_author_accordion_article/about-author-accordion-article.component';
import {
  AboutAuthorArticleComponent,
  aboutAuthorArticleSelector,
} from './about_author_article/about-author-article.component';
import {
  AboutBookArticleComponent,
  aboutBookArticleSelector,
} from './about_book_article/about-book-article.component';
import {
  ArticleBodyComponent,
  articleBodySelector,
} from './article_body/article-body.component';
import {
  AuthorBioComponent,
  authorBioSelector,
} from './author_bio/author-bio.component';
import {
  AuthorsGridComponent,
  authorsGridSelector,
} from './authors_grid/authors-grid.component';
import {
  AuthorsNewReleaseComponent,
  authorsNewReleaseSelector,
} from './authors_new_release/authors-new-release.component';
import {
  AuthorsOnTourComponent,
  authorsOnTourSelector,
} from './authors_on_tour/authors-on-tour.component';
import {
  AwardListComponent,
  awardListSelector,
} from './award_list/award-list.component';
import {
  BookDetailsComponent,
  bookDetailsSelector,
} from './book_details/book-details.component';
import {
  BookPraiseComponent,
  bookPraiseSelector,
} from './book_praise/book-praise.component';
import {
  BooksByAuthorAccordionComponent,
  booksByAuthorAccordionSelector,
} from './books_by_author_accordion/books-by-author-accordion.component';
import {
  CampaignNavComponent,
  campaignNavSelector,
} from './campaign_nav/campaign-nav.component';
import {
  CampaignCategoryComponent,
  campaignCategorySelector,
} from './campaign_category/campaign-category.component';
import {
  CategoryGridComponent,
  categoryGridSelector,
} from './category_grid/category-grid.component';
import {
  ComingSoonNextWeekComponent,
  comingSoonNextWeekSelector,
} from './coming_soon_next_week/coming-soon-next-week.component';
import {
  ComingSoonComponent,
  comingSoonSelector,
} from './coming_soon/coming-soon.component';
import {
  ConnectWithAuthorComponent,
  connectWithAuthorSelector,
} from './connect_with_author/connect-with-author.component';
import {
  MainNavComponent,
  mainNavSelector,
} from './main_nav/main-nav.component';
import {
  FeaturedBookComponent,
  featuredBookSelector,
} from './featured_book/featured-book.component';
import {
  FooterNavComponent,
  footerNavSelector,
} from './footer_nav/footer-nav.component';
import {
  FormatSelectorComponent,
  formatSelectorSelector,
} from './format_selector/format-selector.component';
import {
  HeroArticleComponent,
  heroArticleSelector,
} from './hero_article/hero-article.component';
import {
  HeroComponent,
  heroSelector,
} from './hero/hero.component';
import {
  HeroTwocolComponent,
  heroTwocolSelector,
} from './hero_two_col/hero-two-col.component';
import {
  MoreInCategoryComponent,
  moreInCategorySelector,
} from './more_in_category/more-in-category.component';
import {
  MoreInCategoryArticleComponent,
  moreInCategoryArticleSelector,
} from './more_in_category_article/more-in-category-article.component';
import {
  MoreInSeriesComponent,
  moreInSeriesSelector,
} from './more_in_series/more-in-series.component';
import {
  NewReleaseComponent,
  newReleaseSelector,
} from './new_release/new-release.component';
import {
  NewLastWeekComponent,
  newLastWeekSelector,
} from './new_last_week/new-last-week.component';
import {
  NewLastMonthComponent,
  newLastMonthSelector,
} from './new_last_month/new-last-month.component';
import {
  NewReleaseExcerptComponent,
  newReleaseExcerptSelector,
} from './new_release_excerpt/new-release-excerpt.component';
import {
  NlSignupComponent,
  nlSignupSelector,
} from './nl_signup/nl-signup.component';
import {
  NlSignupByContextComponent,
  nlSignupByContextSelector,
} from './nl_signup_by_context/nl-signup-by-context.component';
import {
  NlSignupByLocationComponent,
  nlSignupByLocationSelector,
} from './nl_signup_by_location/nl-signup-by-location.component';
import {
  NlUnsubscribeComponent,
  nlUnsubscribeSelector,
} from './nl_unsubscribe/nl-unsubscribe.component';
import {
  RecipeBookDetailsComponent,
  recipeBookDetailsSelector,
} from './recipe_book_details/recipe-book-details.component';
import {
  RecipeDirectionsComponent,
  recipeDirectionsSelector,
} from './recipe_directions/recipe-directions.component';
import {
  RecipeIngredientsComponent,
  recipeIngredientsSelector,
} from './recipe_ingredients/recipe-ingredients.component';
import {
  RecipeIntroComponent,
  recipeIntroSelector,
} from './recipe_intro/recipe-intro.component';
import {
  RecipeTipsComponent,
  recipeTipsSelector,
} from './recipe_tips/recipe-tips.component';
import {
  RelatedRecipesComponent,
  relatedRecipesSelector,
} from './related_recipes/related-recipes.component';
import {
  SearchBarGlobalComponent,
  searchBarGlobalSelector,
} from './search_bar_global/search-bar-global.component';
import {
  EventListComponent,
  eventListSelector,
} from './event_list/event-list.component';
import {
  EventListAllLocationComponent,
  eventListAllLocaitonSelector,
} from './event_list_all_location/event-list-all-location.component';
import {
  EventListByLocationComponent,
  eventListByLocaitonSelector,
} from './event_list_by_location/event-list-by-location.component';
import {
  EventListByBookAccordionComponent,
  eventListByBookAccordionSelector,
} from './event_list_by_book_accordion/event-list-by-book-accordion.component';
import {
  EventListByAuthorAccordionComponent,
  eventListByAuthorAccordionSelector,
} from './event_list_by_author_accordion/event-list-by-author-accordion.component';
import {
  EventListByAuthorComponent,
  eventListByAuthorSelector,
} from './event_list_by_author/event-list-by-author.component';
import {
  RelatedContentComponent,
  relatedContentSelector,
} from './related_content/related-content.component';
import {
  BookGridComponent,
  bookGridSelector,
} from './book_grid/book_grid.component';
import {
  AboutBookAccordionComponent,
  aboutBookAccordionSelector,
} from './about_book_accordion/about-book-accordion.component';
import {
  BookContentComponent,
  bookContentSelector,
} from './book_content/book-content.component';
import {
  SearchResultComponent,
  searchResultSelector,
} from './search_result/search-result.component';
import {
  EventDetailsComponent,
  eventDetailsSelector,
} from './event_details/event-details.component';
import {
  SeriesBookListComponent,
  seriesBookListSelector,
} from './series_book_list/series-book-list.component';
import {
  HeroArticleLandingComponent,
  heroArticleLandingSelector,
} from './hero_article_landing/hero-article-landing.component';
import {
  ArticleListComponent,
  articleListSelector,
} from './article_list/article-list.component';
import {
  AboutAuthorInSeriesComponent,
  aboutAuthorInSeriesSelector,
} from './about_author_in_series/about-author-in-series.component';
import {
  SeriesByCategoryWrapperComponent,
  seriesByCategoryWrapperSelector,
} from './series_by_category_wrapper/series-by-category-wrapper.component';
import {
  PageNotFoundComponent,
  pageNotFoundSelector,
} from './page_not_found/page-not-found.component';
import {
  RecipeListComponent,
  recipeListSelector,
} from './recipe_list/recipe-list.component';
import {
  CategoryBookListComponent,
  categoryBookListSelector,
} from './category_book_list/category-book-list.component';
import {
  NlPrefsComponent,
  nlPrefsSelector,
} from './nl_prefs/nl-prefs.component';
import {
  HeroCarouselComponent,
  heroCarouselSelector,
} from './hero_carousel/hero-carousel.component';
import {
  PopUpComponent,
  popUpSelector,
} from './pop_up/pop-up.component';
import {
  PopUpExitComponent,
  popUpExitSelector,
} from './pop_up_exit/pop-up-exit.component';
import {
  ErrorContentComponent,
  errorContentSelector,
} from './error_content/error-content.component';

import {
  SwiperModule,
  SWIPER_CONFIG,
  SwiperConfigInterface
} from 'ngx-swiper-wrapper';

const DEFAULT_COMP_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

// import {
//   EventListByLocationAccordionComponent,
//   eventListByLocationAccordionSelector,
// } from './event_list_by_location_accordion/event-list-by-location-accordion.component';
import {
  MlclGridBookComponent,
  mlclGridBookSelector,
} from '../molecules/mlcl_grid_book/mlcl-grid-book.component';
import {
  MlclArticleListComponent,
  mlclArticleListSelector,
} from '../molecules/mlcl_article_list/mlcl-article-list.component';
import {
  AboutImprintComponent,
  aboutImprintSelector,
} from './about_imprint/about-imprint.component';
import {
  ImprintCtaComponent,
  imprintCtaSelector,
} from './imprint_cta/imprint-cta.component';
import {
  AboutPrhcComponent,
  aboutPrhcSelector,
} from './about_prhc/about-prhc.component';
import {
  CompanyDivisionsComponent,
  companyDivisionsSelector,
} from './company_divisions/company-divisions.component';
import {
  CompanyResourcesComponent,
  companyResourcesSelector,
} from './company_resources/company-resources.component';
import {
  RecipeConclusionComponent,
  recipeConclusionSelector,
} from './recipe_conclusion/recipe-conclusion.component';
import {
  ImprintContentComponent,
  imprintContentSelector,
} from './imprint_content/imprint-content.component';
import {
  AdminNavComponent,
  adminNavSelector,
} from './admin_nav/admin-nav.component';
import {
  AboutBookAccordionArticleComponent,
  aboutBookAccordionArticleSelector,
} from './about_book_accordion_article/about-book-accordion-article.component';
import {
  AddContentComponent,
  addContentSelector,
} from './add_content/add-content.component';
import {
  WebformListComponent,
  webformListSelector,
} from './webform_list/webform-list.component';
import {
  QuizWhoComponent,
  quizWhoSelector,
} from './quiz_who/quiz-who.component';
import {
  QuizRelationshipComponent,
  quizRelationshipSelector,
} from './quiz_relationship/quiz-relationship.component';
import {
  QuizAgeComponent,
  quizAgeSelector,
} from './quiz_age/quiz-age.component';
import {
  QuizFicComponent,
  quizFicSelector,
} from './quiz_fic_nonfic/quiz-fic-nonfic.component';
import {
  QuizGenreComponent,
  quizGenreSelector,
} from './quiz_genre/quiz-genre.component';
import {
  QuizAudiobooksComponent,
  quizAudiobooksSelector,
} from './quiz_audiobooks/quiz-audiobooks.component';
import {
  QuizBookClubComponent,
  quizBookClubSelector,
} from './quiz_book_club/quiz-book-club.component';
import {
  QuizAuthorComponent,
  quizAuthorSelector,
} from './quiz_author/quiz-author.component';
import {
  QuizQuantityComponent,
  quizQuantitySelector,
} from './quiz_quantity/quiz-quantity.component';
import {
  QuizResultComponent,
  quizResultSelector,
} from './quiz_result/quiz-result.component';
import {
  SavedBooksComponent,
  savedBooksSelector,
} from './saved_books/saved-books.component';
import {
  QuizSignupComponent,
  quizSignupSelector,
} from './quiz_signup/quiz-signup.component';
import {
  QuizGenreChildComponent,
  quizGenreChildSelector,
} from './quiz_genre-child/quiz-genre-child.component';
import {
  QuizLearnFunComponent,
  quizLearnFunSelector,
} from './quiz_learn_fun/quiz-learn-fun.component';
import {
  QuizCharactersComponent,
  quizCharactersSelector,
} from './quiz_characters/quiz-characters.component';
// import {
//   StyleGuideModule,
//   styleGuideSelectors,
// } from './documentation/style_guide/style-guide.module';
// import {
//   ApiIoDocComponent,
//   apiIoDocSelector,
// } from './documentation/api-io-doc/api-io-doc.component';

export const componentSelectors = [
  // ...styleGuideSelectors,
  // aboutAuthorSelector,
  // apiIoDocSelector,
  aboutAuthorAccordionSelector,
  aboutAuthorAccordionArticleSelector,
  aboutAuthorArticleSelector,
  aboutBookArticleSelector,
  articleBodySelector,
  authorBioSelector,
  authorsGridSelector,
  authorsNewReleaseSelector,
  authorsOnTourSelector,
  awardListSelector,
  bookDetailsSelector,
  bookPraiseSelector,
  booksByAuthorAccordionSelector,
  campaignNavSelector,
  campaignCategorySelector,
  categoryGridSelector,
  comingSoonNextWeekSelector,
  comingSoonSelector,
  connectWithAuthorSelector,
  eventListSelector,
  eventListAllLocaitonSelector,
  eventListByLocaitonSelector,
  eventListByAuthorAccordionSelector,
  eventListByAuthorSelector,
  eventListByBookAccordionSelector,
  featuredBookSelector,
  footerNavSelector,
  formatSelectorSelector,
  heroArticleSelector,
  heroSelector,
  heroTwocolSelector,
  mainNavSelector,
  moreInCategorySelector,
  moreInCategoryArticleSelector,
  moreInSeriesSelector,
  newReleaseSelector,
  newLastWeekSelector,
  newLastMonthSelector,
  newReleaseExcerptSelector,
  nlSignupSelector,
  nlSignupByContextSelector,
  nlSignupByLocationSelector,
  nlUnsubscribeSelector,
  recipeBookDetailsSelector,
  recipeDirectionsSelector,
  recipeIngredientsSelector,
  recipeIntroSelector,
  recipeTipsSelector,
  relatedRecipesSelector,
  relatedContentSelector,
  searchBarGlobalSelector,
  bookGridSelector,
  aboutBookAccordionSelector,
  bookContentSelector,
  searchResultSelector,
  eventDetailsSelector,
  seriesBookListSelector,
  heroArticleLandingSelector,
  articleListSelector,
  aboutAuthorInSeriesSelector,
  seriesByCategoryWrapperSelector,
  pageNotFoundSelector,
  recipeListSelector,
  categoryBookListSelector,
  nlPrefsSelector,
  heroCarouselSelector,
  popUpSelector,
  popUpExitSelector,
  errorContentSelector,
  // eventListByLocationAccordionSelector,
  mlclGridBookSelector,
  mlclArticleListSelector,
  aboutImprintSelector,
  imprintCtaSelector,
  aboutPrhcSelector,
  companyDivisionsSelector,
  companyResourcesSelector,
  recipeConclusionSelector,
  imprintContentSelector,
  adminNavSelector,
  aboutBookAccordionArticleSelector,
  addContentSelector,
  webformListSelector,
  quizWhoSelector,
  quizRelationshipSelector,
  quizAgeSelector,
  quizFicSelector,
  quizGenreSelector,
  quizAudiobooksSelector,
  quizBookClubSelector,
  quizAuthorSelector,
  quizQuantitySelector,
  quizResultSelector,
  savedBooksSelector,
  quizSignupSelector,
  quizGenreChildSelector,
  quizLearnFunSelector,
  quizCharactersSelector,
];

const declarations = [
  AboutAuthorAccordionComponent,
  AboutAuthorAccordionArticleComponent,
  AboutAuthorArticleComponent,
  AboutBookArticleComponent,
  ArticleBodyComponent,
  AuthorBioComponent,
  AuthorsGridComponent,
  AuthorsNewReleaseComponent,
  AuthorsOnTourComponent,
  AwardListComponent,
  BookDetailsComponent,
  BookPraiseComponent,
  BooksByAuthorAccordionComponent,
  CampaignNavComponent,
  CampaignCategoryComponent,
  CategoryGridComponent,
  ComingSoonNextWeekComponent,
  ComingSoonComponent,
  ConnectWithAuthorComponent,
  EventListComponent,
  EventListAllLocationComponent,
  EventListByLocationComponent,
  EventListByAuthorAccordionComponent,
  EventListByAuthorComponent,
  EventListByBookAccordionComponent,
  FeaturedBookComponent,
  FooterNavComponent,
  FormatSelectorComponent,
  HeroArticleComponent,
  HeroComponent,
  HeroTwocolComponent,
  MainNavComponent,
  MoreInCategoryComponent,
  MoreInCategoryArticleComponent,
  MoreInSeriesComponent,
  NewReleaseComponent,
  NewLastWeekComponent,
  NewLastMonthComponent,
  NewReleaseExcerptComponent,
  NlSignupComponent,
  NlSignupByContextComponent,
  NlSignupByLocationComponent,
  NlUnsubscribeComponent,
  RecipeBookDetailsComponent,
  RecipeDirectionsComponent,
  RecipeIngredientsComponent,
  RecipeIntroComponent,
  RecipeTipsComponent,
  RelatedRecipesComponent,
  RelatedContentComponent,
  SearchBarGlobalComponent,
  BookGridComponent,
  AboutBookAccordionComponent,
  BookContentComponent,
  SearchResultComponent,
  EventDetailsComponent,
  SeriesBookListComponent,
  HeroArticleLandingComponent,
  ArticleListComponent,
  AboutAuthorInSeriesComponent,
  SeriesByCategoryWrapperComponent,
  PageNotFoundComponent,
  RecipeListComponent,
  CategoryBookListComponent,
  NlPrefsComponent,
  HeroCarouselComponent,
  PopUpComponent,
  PopUpExitComponent,
  ErrorContentComponent,
  // EventListByLocationAccordionComponent,
  MlclGridBookComponent,
  MlclArticleListComponent,
  AboutImprintComponent,
  ImprintCtaComponent,
  AboutPrhcComponent,
  CompanyDivisionsComponent,
  CompanyResourcesComponent,
  RecipeConclusionComponent,
  ImprintContentComponent,
  AdminNavComponent,
  AboutBookAccordionArticleComponent,
  AddContentComponent,
  WebformListComponent,
  QuizWhoComponent,
  QuizRelationshipComponent,
  QuizAgeComponent,
  QuizFicComponent,
  QuizGenreComponent,
  QuizAudiobooksComponent,
  QuizBookClubComponent,
  QuizAuthorComponent,
  QuizQuantityComponent,
  QuizResultComponent,
  SavedBooksComponent,
  QuizSignupComponent,
  QuizGenreChildComponent,
  QuizLearnFunComponent,
  QuizCharactersComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Angular2FontawesomeModule,
    AtomsModule,
    MoleculesModule,
    SharedModule,
    ServicesModule,
    SwiperModule,
    // StyleGuideModule,
  ],
  exports: [...declarations],
  entryComponents: [...declarations],
  declarations,
  providers: [
    { provide: aboutAuthorAccordionSelector, useValue: AboutAuthorAccordionComponent },
    { provide: aboutAuthorAccordionArticleSelector, useValue: AboutAuthorAccordionArticleComponent },
    { provide: aboutAuthorArticleSelector, useValue: AboutAuthorArticleComponent },
    { provide: aboutBookArticleSelector, useValue: AboutBookArticleComponent },
    { provide: articleBodySelector, useValue: ArticleBodyComponent },
    { provide: authorBioSelector, useValue: AuthorBioComponent },
    { provide: authorsGridSelector, useValue: AuthorsGridComponent },
    { provide: authorsNewReleaseSelector, useValue: AuthorsNewReleaseComponent },
    { provide: authorsOnTourSelector, useValue: AuthorsOnTourComponent },
    { provide: awardListSelector, useValue: AwardListComponent },
    { provide: bookDetailsSelector, useValue: BookDetailsComponent },
    { provide: bookPraiseSelector, useValue: BookPraiseComponent },
    { provide: booksByAuthorAccordionSelector, useValue: BooksByAuthorAccordionComponent },
    { provide: campaignNavSelector, useValue: CampaignNavComponent },
    { provide: campaignCategorySelector, useValue: CampaignCategoryComponent },
    { provide: categoryGridSelector, useValue: CategoryGridComponent },
    { provide: comingSoonNextWeekSelector, useValue: ComingSoonNextWeekComponent },
    { provide: comingSoonSelector, useValue: ComingSoonComponent },
    { provide: connectWithAuthorSelector, useValue: ConnectWithAuthorComponent },
    { provide: eventListSelector, useValue: EventListComponent },
    { provide: eventListAllLocaitonSelector, useValue: EventListAllLocationComponent },
    { provide: eventListByLocaitonSelector, useValue: EventListByLocationComponent },
    { provide: eventListByAuthorAccordionSelector, useValue: EventListByAuthorAccordionComponent },
    { provide: eventListByAuthorSelector, useValue: EventListByAuthorComponent },
    { provide: eventListByBookAccordionSelector, useValue: EventListByBookAccordionComponent },
    { provide: featuredBookSelector, useValue: FeaturedBookComponent },
    { provide: footerNavSelector, useValue: FooterNavComponent },
    { provide: formatSelectorSelector, useValue: FormatSelectorComponent },
    { provide: heroArticleSelector, useValue: HeroArticleComponent },
    { provide: heroSelector, useValue: HeroComponent },
    { provide: heroTwocolSelector, useValue: HeroTwocolComponent },
    { provide: mainNavSelector, useValue: MainNavComponent },
    { provide: moreInCategorySelector, useValue: MoreInCategoryComponent },
    { provide: moreInCategoryArticleSelector, useValue: MoreInCategoryArticleComponent },
    { provide: moreInSeriesSelector, useValue: MoreInSeriesComponent },
    { provide: newReleaseSelector, useValue: NewReleaseComponent },
    { provide: newLastWeekSelector, useValue: NewLastWeekComponent },
    { provide: newLastMonthSelector, useValue: NewLastMonthComponent },
    { provide: newReleaseExcerptSelector, useValue: NewReleaseExcerptComponent },
    { provide: nlSignupSelector, useValue: NlSignupComponent },
    { provide: nlSignupByContextSelector, useValue: NlSignupByContextComponent },
    { provide: nlSignupByLocationSelector, useValue: NlSignupByLocationComponent },
    { provide: nlUnsubscribeSelector, useValue: NlUnsubscribeComponent },
    { provide: recipeBookDetailsSelector, useValue: RecipeBookDetailsComponent },
    { provide: recipeDirectionsSelector, useValue: RecipeDirectionsComponent },
    { provide: recipeIngredientsSelector, useValue: RecipeIngredientsComponent },
    { provide: recipeIntroSelector, useValue: RecipeIntroComponent },
    { provide: recipeTipsSelector, useValue: RecipeTipsComponent },
    { provide: relatedRecipesSelector, useValue: RelatedRecipesComponent },
    { provide: relatedContentSelector, useValue: RelatedContentComponent },
    { provide: searchBarGlobalSelector, useValue: RelatedRecipesComponent },
    { provide: bookGridSelector, useValue: BookGridComponent },
    { provide: aboutBookAccordionSelector, useValue: AboutBookAccordionComponent },
    { provide: bookContentSelector, useValue: BookContentComponent },
    { provide: searchResultSelector, useValue: SearchResultComponent },
    { provide: eventDetailsSelector, useValue: EventDetailsComponent },
    { provide: seriesBookListSelector, useValue: SeriesBookListComponent },
    { provide: heroArticleLandingSelector, useValue: HeroArticleLandingComponent },
    { provide: articleListSelector, useValue: ArticleListComponent },
    { provide: aboutAuthorInSeriesSelector, useValue: AboutAuthorInSeriesComponent },
    { provide: seriesByCategoryWrapperSelector, useValue: SeriesByCategoryWrapperComponent },
    { provide: pageNotFoundSelector, useValue: PageNotFoundComponent },
    { provide: recipeListSelector, useValue: RecipeListComponent },
    { provide: categoryBookListSelector, useValue: CategoryBookListComponent },
    { provide: nlPrefsSelector, useValue: NlPrefsComponent },
    { provide: heroCarouselSelector, useValue: HeroCarouselComponent },
    { provide: SWIPER_CONFIG, useValue: DEFAULT_COMP_SWIPER_CONFIG },
    { provide: popUpSelector, useValue: PopUpComponent },
    { provide: popUpExitSelector, useValue: PopUpExitComponent },
    { provide: errorContentSelector, useValue: ErrorContentComponent },
    // { provide: eventListByLocationAccordionSelector, useValue: EventListByLocationAccordionComponent },
    // { provide: aboutAuthorSelector, useValue: AboutAuthorComponent },
    { provide: mlclGridBookSelector, useValue: MlclGridBookComponent },
    { provide: mlclArticleListSelector, useValue: MlclArticleListComponent },
    // { provide: apiIoDocSelector, useValue: ApiIoDocComponent },
    { provide: aboutImprintSelector, useValue: AboutImprintComponent },
    { provide: imprintCtaSelector, useValue: ImprintCtaComponent },
    { provide: aboutPrhcSelector, useValue: AboutPrhcComponent },
    { provide: companyDivisionsSelector, useValue: CompanyDivisionsComponent },
    { provide: companyResourcesSelector, useValue: CompanyResourcesComponent },
    { provide: recipeConclusionSelector, useValue: RecipeConclusionComponent },
    { provide: imprintContentSelector, useValue: ImprintContentComponent },
    { provide: adminNavSelector, useValue: AdminNavComponent },
    { provide: aboutBookAccordionArticleSelector, useValue: AboutBookAccordionArticleComponent },
    { provide: addContentSelector, useValue: AddContentComponent },
    { provide: webformListSelector, useValue: WebformListComponent },
    { provide: quizWhoSelector, useValue: QuizWhoComponent },
    { provide: quizRelationshipSelector, useValue: QuizRelationshipComponent },
    { provide: quizAgeSelector, useValue: QuizAgeComponent },
    { provide: quizFicSelector, useValue: QuizFicComponent },
    { provide: quizGenreSelector, useValue: QuizGenreComponent },
    { provide: quizAudiobooksSelector, useValue: QuizAudiobooksComponent },
    { provide: quizBookClubSelector, useValue: QuizBookClubComponent },
    { provide: quizAuthorSelector, useValue: QuizAuthorComponent },
    { provide: quizQuantitySelector, useValue: QuizQuantityComponent },
    { provide: quizResultSelector, useValue: QuizResultComponent },
    { provide: savedBooksSelector, useValue: SavedBooksComponent },
    { provide: quizSignupSelector, useValue: QuizSignupComponent },
    { provide: quizGenreChildSelector, useValue: QuizGenreChildComponent },
    { provide: quizLearnFunSelector, useValue: QuizLearnFunComponent },
    { provide: quizCharactersSelector, useValue: QuizCharactersComponent },
  ],
})
export class ComponentsModule {}
