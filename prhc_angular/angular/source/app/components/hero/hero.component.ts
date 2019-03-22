import {
  Component,
  OnInit,
  OnDestroy,
  Injectable,
} from '@angular/core';
import { getProvinceName } from '../../services/common.service';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';
import { EnhancedApiService } from '../../services/enhanced_api.service';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const heroSelector = 'hero';

@Component({
  selector: heroSelector,
  templateUrl: './hero.component.html',
})
@Injectable()
export class HeroComponent implements OnInit, OnDestroy {
  isLoaded = false;
  pageTitle: string;
  pageSubtitle: string;
  contributors: any;
  catId: number;
  breadcrumbItems = [];
  description: string;
  bookData = {};
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService, private prhcApi: PrhcApiService ) {}

  ngOnInit() {
    // let url = getRequestUrl();
    const currentContentInfo = getCurrentContentInfo();

    // api content pages.
    if (
      currentContentInfo.id &&
      (!isNaN(parseFloat(currentContentInfo.id)) ||
      currentContentInfo.type === 'imprints' ||
      currentContentInfo.type === 'series')
    ) {
      let request: any;
      if (currentContentInfo.type === 'books') {
        request = this.enhanced.getTitle(currentContentInfo.isbn, 'display');
      } else if (
        currentContentInfo.type === 'excerpts' ||
        currentContentInfo.type === 'book-club-resources'
      ) {
        this.pageTitle = currentContentInfo.type === 'excerpts' ? 'Excerpts' : 'Reading Guides';
        request = this.enhanced.getCategory(currentContentInfo.id);
      } else if (currentContentInfo.type === 'categories') {
        request = this.enhanced.getCategoryHierarchy(currentContentInfo.id);
      } else if (currentContentInfo.type === 'series') {
        request = this.enhanced.getSeriesAuthors();
      } else if (currentContentInfo.type === 'imprints' && currentContentInfo.last === 'about') {
        // title for imprint about page
        request = this.prhcApi.getImprint(currentContentInfo.id);
      } else {
        request = this.enhanced.getData();
      }
      this.requestApiData(request, currentContentInfo);
    } else {
      const heroData = setPageTitleForLandingPages(currentContentInfo.type, currentContentInfo.id);
      this.pageTitle = heroData.title;
      this.pageSubtitle = heroData.subtitle;
      this.breadcrumbItems = heroData.breadcrumbs;
    }

    if (currentContentInfo.type === 'about') {
      this.pageTitle = 'About Penguin Random House Canada';
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * call api to generate page title.
   *
   * @param {url} api url
   */
  requestApiData(request, currentContentInfo) {
    switch (currentContentInfo.type) {
      case 'books':
        request.subscribe(response => {
          if (response['data'] && response['data'].length) {
            response['data'].map(content => {

              this.bookData = {
                title: content.title,
                isbn: content.isbn,
                workId: content.workId,
              };

              const heroData = setPageTitle(content, currentContentInfo);
              this.pageTitle = heroData.title;
              this.pageSubtitle = heroData.subtitle;
              this.contributors = content.contributors;
            });
            this.isLoaded = true;
          }
        });
        break;
      case 'series':
        // get results
        request.subscribe(response => {
          // set page title
          if (
            response.series &&
            response.series.data &&
            response.series.data.length
          ) {
            response.series.data.map(set => {
              this.pageTitle = set.seriesName;
              if (set.description) {
                this.description = set.description;
              }
            });
          }

          // set contributors
          if (
            response.series.data[0].isNumbered &&
            response.authors &&
            response.authors.recordCount <= 3 &&
            response.authors['data']
          ) {
            response.authors['data'].map(author => {
              author.roleName = 'Written by';
            });
            this.contributors = response.authors.data;
          }
        });
        break;

      case 'imprints':
        request.subscribe(response => {
          if (currentContentInfo.last === 'about') {
            response['data'].map(currentImprint => {
              this.pageTitle = currentImprint.attributes.field_about_section_title;
              this.breadcrumbItems = [
                {
                  name: currentImprint.attributes.title,
                  seoFriendlyUrl: window.location.pathname.replace('/about', '/'),
                },
                {
                  name: currentImprint.attributes.field_about_section_title,
                  seoFriendlyUrl: window.location.pathname,
                }
              ];
            });
          } else {
              response['data'].map(imprint => {
                const heroData = setPageTitle(imprint, currentContentInfo);
                this.pageTitle = heroData.title;
                this.breadcrumbItems = heroData.breadcrumbs;
              });
            }
        });
      break;

      default:
        // call api to get current api content data
        this.subscriptions.add(
          request.subscribe(response => {
            response.data.map(content => {
              const heroData = setPageTitle(content, currentContentInfo);
              this.pageTitle = heroData.title;
              this.breadcrumbItems = heroData.breadcrumbs;
            });
           })
        );
        break;
    }
  }
}

export function setPageTitle(content, currentContentInfo) {
  let pageTitle: string;
  let pageSubtitle: string;
  let breadcrumbItems: any;

  switch (currentContentInfo.type) {
    // book view, reading guides, excerepts  pages
    case 'books':
    pageTitle = 'Excerpt';
      if (currentContentInfo.bookContent) {
         pageTitle = currentContentInfo.bookContent === 'excerpt' ? 'Excerpt' : 'Reading Guide';
         pageSubtitle = `From <i>${content.title}</i>`;
      }
      break;
    // event view page
    case 'events':
      pageTitle = content.location;
      if (content.authors) {
        pageTitle = content.authors[0].display + ' at ' + content.location;
      }
      break;

    // author view page
    case 'authors':
      pageTitle = content.display;
      if (
        currentContentInfo.last &&
        currentContentInfo.last === 'events'
      ) {
        pageTitle = 'Events with ' + pageTitle;
        breadcrumbItems = parseBreadcrumb('Events', content.display);
      }
      break;

    // category landing page
    case 'categories':
      pageTitle = content.catDesc;
      // this.catId = content.catId;
      if (content.parent && content.parent.catId !== 2000000000) {
        const parentUrl = '/categories/' +
        content.parent.catId +
        content.parent.catUri;
        breadcrumbItems = parseBreadcrumb(content.catDesc, content.parent.catDesc, parentUrl);
      }
      break;

    // excerpts landing pages
    case 'excerpts':
      pageTitle = 'Excerpts';
      breadcrumbItems = parseBreadcrumb(
        content.description,
        pageTitle,
        '/' + currentContentInfo.type,
      );
      pageTitle = content.description + ' ' + pageTitle;
      break;

    // book clubs landing pages
    case 'book-club-resources':
      pageTitle = 'Reading Guides';
      breadcrumbItems = parseBreadcrumb(
        content.description,
        'Book Club Resources',
        '/' + currentContentInfo.type,
      );
      pageTitle = content.description + ' ' + pageTitle;
      break;

    // imprints landing page
    case 'imprints':
      if (currentContentInfo.last) {
        const pageType =
          currentContentInfo.last.charAt(0).toUpperCase() +
          currentContentInfo.last.slice(1);
        pageTitle = pageType + ' Published by ';
        breadcrumbItems = parseBreadcrumb(pageType, content.description);
      }
      pageTitle += content.description;
      break;
  }
  return {
    title: pageTitle,
    subtitle: pageSubtitle,
    breadcrumbs: breadcrumbItems,
  };
}

export function setPageTitleForLandingPages(type, id?) {
  let pageTitle: string;
  let pageSubtitle: string;
  let breadcrumbItems = [];

  switch (type) {
    case 'search':
      pageTitle = 'Search Results';
      break;

    // events in province landing pages.
    case 'events':
      if (id) {
        const location = getProvinceName(id);
        pageTitle = 'Events in ' + location;
        breadcrumbItems = parseBreadcrumb(location, 'Events', '/events');
      } else {
        pageTitle = 'Events';
      }
      break;

      case 'books':
        if (!id) {
          pageTitle = 'Books';
          pageSubtitle = 'Browse by category to find your next great read';
        }
      break;

    default:
      const title = type;
      const titleArr = title.split('-');

      pageTitle = title.charAt(0).toUpperCase() + title.slice(1);

      if (titleArr.length > 1) {
        for (const key in titleArr) {
          if (titleArr.hasOwnProperty(key)) {
            titleArr[key] =
              titleArr[key].charAt(0).toUpperCase() +
              titleArr[key].slice(1);
          }
        }
        pageTitle = titleArr.join(' ');
      }
      break;
  }
  return {
    title: pageTitle,
    subtitle: pageSubtitle,
    breadcrumbs: breadcrumbItems,
  };
}

/**
 * generate breadcrumb if it's required
 *
 * @param {currentName} current page's name in breadcrumb
 * @param {parentName} parent link's name in breadcrumb
 * @param {parentUrl} optional. parent's url in breadcrumb
 */
export function parseBreadcrumb(currentName, parentName, parentUrl?) {
  const breadcrumbItems = [];
  const currentUrl = window.location.pathname;

  // Change value of nonfiction to have hyphen
  if (currentName === 'Nonfiction') {
    currentName = 'Non-Fiction';
  }
  if (parentName === 'Nonfiction') {
    parentName = 'Non-Fiction';
  }

  // set parent link in breadcrumb
  const parent = {
    name: parentName,
    seoFriendlyUrl: undefined,
  };

  if (parentUrl) {
    parent.seoFriendlyUrl = parentUrl;
  } else {
    const urlArray = currentUrl.split('/');
    urlArray.splice(-1, 1);
    parent.seoFriendlyUrl = urlArray.join('/');
  }

  breadcrumbItems.push(parent);

  // set current link in breadcrumb
  const current = {
    name: currentName,
    seoFriendlyUrl: undefined,
  };

  current.seoFriendlyUrl = currentUrl;
  breadcrumbItems.push(current);
  return breadcrumbItems;
}
