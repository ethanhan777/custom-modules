import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';
import { AgmCoreModule } from '@agm/core';

import { MlclAccordionHeaderComponent } from './mlcl_accordion_header/mlcl-accordion-header.component';
import { MlclAboutAuthorComponent } from './mlcl_about_author/mlcl-about-author.component';
import { MlclAboutBookComponent } from './mlcl_about_book/mlcl-about-book.component';
import { MlclAuthorSocialLinksComponent } from './mlcl_author_social_links/mlcl-author-social-links.component';
import { MlclBreadcrumbComponent } from './mlcl_breadcrumb/mlcl-breadcrumb.component';
import { MlclBooksByAuthorComponent } from './mlcl_books_by_author/mlcl-books-by-author.component';
import {
  MlclBooksByAuthorOtherPublisherComponent
} from './mlcl_books_by_author_other_publisher/mlcl-books-by-author-other-publisher.component';
import { MlclBuyIndependentComponent } from './mlcl_buy_independent/mlcl-buy-independent.component';
import { MlclCampaignCategoryHeadingComponent } from './mlcl_campaign_category_heading/mlcl-campaign-category-heading.component';
import { MlclCampaignCTAComponent } from './mlcl_campaign_cta/mlcl-campaign-cta.component';
import { MlclCampaignRetailerLinksComponent } from './mlcl_campaign_retailer_links/mlcl-campaign-retailer-links.component';
import { MlclCampaignFeaturedAuthorComponent } from './mlcl_campaign_featured_author/mlcl-campaign-featured-author.component';
import { MlclCampaignFeaturedBookComponent } from './mlcl_campaign_featured_book/mlcl-campaign-featured-book.component';
import { MlclCampaignSliderComponent } from './mlcl_campaign_slider/mlcl-campaign-slider.component';
import { MlclCampaignCategoryComponent } from './mlcl_campaign_category/mlcl-campaign-category.component';
import { MlclCategorySliderArticleComponent } from './mlcl_category_slider_article/mlcl-category-slider-article.component';
import { MlclCategorySliderComponent } from './mlcl_category_slider/mlcl-category-slider.component';
import { MlclContributorsComponent } from './mlcl_contributors/mlcl-contributors.component';
import { MlclContributedByAuthorComponent } from './mlcl_contributed_by_author/mlcl-contributed-by-author.component';
import { MlclCoverComponent } from './mlcl_cover/mlcl-cover.component';
import { MlclCoverListItemComponent } from './mlcl_cover_list_item/mlcl-cover-list-item.component';
import { MlclCoverSeriesComponent } from './mlcl_cover_series/mlcl-cover-series.component';
import { MlclCoverSmallComponent } from './mlcl_cover_small/mlcl-cover-small.component';
import { MlclCTAItemComponent } from './mlcl_cta_item/mlcl-cta-item.component';
import { MlclEventListItemComponent } from './mlcl_event_list_item/mlcl-event-list-item.component';
import { MlclEventListAccordionComponent } from './mlcl_event_list_accordion/mlcl-event-list-accordion.component';
import { MlclEventListLoadMoreComponent } from './mlcl_event_list_load-more/mlcl-event-list-load-more.component';
import { MlclGridAuthorsComponent } from './mlcl_grid_authors/mlcl-grid-authors.component';
import { MlclHeroDescComponent } from './mlcl_hero_desc/mlcl-hero-desc.component';
import { MlclHeroSeriesComponent } from './mlcl_hero_series/mlcl-hero-series.component';
import { MlclHeroTitleComponent } from './mlcl_hero_title/mlcl-hero-title.component';
import { MlclListItemComponent } from './mlcl_list_item/mlcl-list-item.component';
import { MlclLoaderComponent } from './mlcl_loader/mlcl-loader.component';
import { MlclNavItemComponent } from './mlcl_nav_item/mlcl-nav-item.component';
import { MlclNavSliderComponent } from './mlcl_nav_slider/mlcl-nav-slider.component';
import { MlclNlContextFormComponent } from './mlcl_nl_context_form/mlcl-nl-context-form.component';
import { MlclNlGlobalFormComponent } from './mlcl_nl_global_form/mlcl-nl-global-form.component';
import { MlclNlLegalComponent } from './mlcl_nl_legal/mlcl-nl-legal.component';
import { MlclNlSignupHeaderComponent } from './mlcl_nl_signup_header/mlcl-nl-signup-header.component';
import { MlclNlTyMessageComponent } from './mlcl_nl_ty_message/mlcl-nl-ty-message.component';
import { MlclNlConfirmMessageComponent } from './mlcl_nl_confirm_message/mlcl-nl-confirm-message.component';
import { MlclPaginationComponent } from './mlcl_pagination/mlcl-pagination.component';
import { MlclPaginationAlphabetComponent } from './mlcl_pagination_alphabet/mlcl-pagination-alphabet.component';
import { MlclRelatedVideosComponent } from './mlcl_related_videos/mlcl-related-videos.component';
import { MlclSearchBarComponent } from './mlcl_search_bar/mlcl-search-bar.component';
import { MlclSearchCurrentFacetsComponent } from './mlcl_search_current_facets/mlcl-search-current-facets.component';
import { MlclSearchFacetComponent } from './mlcl_search_facet/mlcl-search-facet.component';
import { MlclSearchFacetDateComponent } from './mlcl_search_facet_date/mlcl-search-facet-date.component';
import { MlclSearchFacetDoctypeComponent } from './mlcl_search_facet_doctype/mlcl-search-facet-doctype.component';
import { MlclSliderComponent } from './mlcl_slider/mlcl-slider.component';
import { MlclSliderItemComponent } from './mlcl_slider_item/mlcl-slider-item.component';
import { MlclSocialComponent } from './mlcl_social/mlcl-social.component';
import { MlclSocialFooterComponent } from './mlcl_social_footer/mlcl-social-footer.component';
import { MlclSeriesByAuthorComponent } from './mlcl_series_by_author/mlcl-series-by-author.component';
import { MlclTagItemComponent } from './mlcl_tag_item/mlcl-tag-item.component';
import { MlclCategoryItemComponent } from './mlcl_category_item/mlcl-category-item.component';
import { MlclNlProgramsComponent } from './mlcl_nl_programs/mlcl-nl-programs.component';
import { MlclNlSubscriberComponent } from './mlcl_nl_subscriber/mlcl-nl-subscriber.component';
import { MlclBuyWorkflowComponent } from './mlcl_buy_workflow/mlcl_buy_workflow.component';
import { MlclFormComponent } from './mlcl_form/mlcl-form.component';
import { MlclFeaturedBookComponent } from './mlcl_featured_book/mlcl-featured-book.component';
import { MlclRecoCTAComponent } from './mlcl_reco_cta/mlcl-reco-cta.component';
import { MlclSavedBookItemComponent } from './mlcl_saved_book_item/mlcl-saved-book-item.component';
import { MlclSavedBookListComponent } from './mlcl_saved_book_list/mlcl-saved-book-list.component';
import { MlclRecoCuratedPicksComponent } from './mlcl_reco_curated_picks/mlcl-reco-curated-picks.component';

import { AtomsModule } from '../atoms/atoms.module';
import { SharedModule } from '../shared/shared.module';

import {
  SwiperModule,
  SWIPER_CONFIG,
  SwiperConfigInterface,
} from 'ngx-swiper-wrapper';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  watchOverflow: true,
  grabCursor: true,
  // preventClicks: true,
  // preventClicksPropagation: true,
  // slidesPerGroup: 3,
  spaceBetween: 26,
  initialSlide: 0,
  // navigation: {
  //   nextEl: '.slider-arrow-right',
  //   prevEl: '.slider-arrow-left',
  // },
};

const declarations = [
  MlclAccordionHeaderComponent,
  MlclAboutAuthorComponent,
  MlclAboutBookComponent,
  MlclAuthorSocialLinksComponent,
  MlclBreadcrumbComponent,
  MlclBooksByAuthorComponent,
  MlclBooksByAuthorOtherPublisherComponent,
  MlclBuyIndependentComponent,
  MlclCampaignCategoryHeadingComponent,
  MlclCampaignCTAComponent,
  MlclCampaignRetailerLinksComponent,
  MlclCampaignFeaturedAuthorComponent,
  MlclCampaignFeaturedBookComponent,
  MlclCampaignSliderComponent,
  MlclCampaignCategoryComponent,
  MlclCategorySliderArticleComponent,
  MlclCategorySliderComponent,
  MlclContributorsComponent,
  MlclContributedByAuthorComponent,
  MlclCoverComponent,
  MlclCoverListItemComponent,
  MlclCoverSeriesComponent,
  MlclCoverSmallComponent,
  MlclCTAItemComponent,
  MlclEventListItemComponent,
  MlclEventListAccordionComponent,
  MlclEventListLoadMoreComponent,
  MlclGridAuthorsComponent,
  MlclHeroDescComponent,
  MlclHeroSeriesComponent,
  MlclHeroTitleComponent,
  MlclListItemComponent,
  MlclLoaderComponent,
  MlclNavItemComponent,
  MlclNavSliderComponent,
  MlclNlContextFormComponent,
  MlclNlGlobalFormComponent,
  MlclNlLegalComponent,
  MlclNlSignupHeaderComponent,
  MlclNlTyMessageComponent,
  MlclNlConfirmMessageComponent,
  MlclPaginationComponent,
  MlclPaginationAlphabetComponent,
  MlclRelatedVideosComponent,
  MlclSearchBarComponent,
  MlclSearchCurrentFacetsComponent,
  MlclSearchFacetComponent,
  MlclSearchFacetDateComponent,
  MlclSearchFacetDoctypeComponent,
  MlclSliderComponent,
  MlclSliderItemComponent,
  MlclSocialComponent,
  MlclSocialFooterComponent,
  MlclSeriesByAuthorComponent,
  MlclTagItemComponent,
  MlclCategoryItemComponent,
  MlclNlProgramsComponent,
  MlclNlSubscriberComponent,
  MlclBuyWorkflowComponent,
  MlclFormComponent,
  MlclFeaturedBookComponent,
  MlclRecoCTAComponent,
  MlclSavedBookItemComponent,
  MlclSavedBookListComponent,
  MlclRecoCuratedPicksComponent
];

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    Angular2FontawesomeModule,
    SwiperModule,
    AtomsModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA42-0Y8oiw4orTskCVreDHd6Zv3PgdK7k'
    })
  ],
  exports: [...declarations],
  providers: [
    { provide: SWIPER_CONFIG, useValue: DEFAULT_SWIPER_CONFIG },
  ],
  declarations,
})
export class MoleculesModule {}
