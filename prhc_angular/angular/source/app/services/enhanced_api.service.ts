import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/catch';

import {
  getCalculatedDateByDay,
  getCalculatedDateByMonth
} from '../services/date_format.service';
import {
  formatDate,
  getMonthFormatted,
  getDayRaw,
  getYearRaw
} from '../services/date_format.service';
import { isValidUrl } from '../services/common.service';

/**
 * PRH Enhanced api service.
 */
@Injectable()
export class EnhancedApiService {
  // http options
  params: any = {};
  // search term
  searchTerm = '';
  // api url for search result
  searchUrl = '/api/enhanced/search/';

  constructor(protected http: HttpClient) {}

  getData(url?, params?) {
    url = url ? url : getRequestUrl();
    params = params ? params : {};

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getTitle(isbn, method, params?) {
    let url = '';
    if (!params) {
      params = {};
    }

    if (Array.isArray(isbn)) {
      url = getRequestUrl('titles');
      params['isbn'] = isbn.join(',');
      params['rows'] = '0';
    } else {
      url = getRequestUrl('titles', isbn);
    }
    url += method ? '/' + method : '';

    return this.http.get(url, getHttpOptions(params))
      .map(response => parseTitle(response, method));
  }

  getWork(workId, method, params?) {
    let url = '';
    if (!params) {
      params = {};
    }

    if (Array.isArray(workId)) {
      url = getRequestUrl('works');
      params['workId'] = workId.join(',');
      params['rows'] = '0';
    } else {
      url = getRequestUrl('works', workId);
    }
    url += method ? '/' + method : '';

    return this.http.get(url, getHttpOptions(params))
      .map(response => parseTitle(response, method));
  }

  getTitleCategories(isbn, rows) {
    const url = getRequestUrl('titles', isbn) + '/categories';
    const params = {
      // catSeq: '1,2,3,4',
      catSetId: 'CN',
      sort: 'seq',
      dir: 'desc',
      rows: rows,
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
      // .map(parseTitleCategories);
  }

  getCategorySeries(catId, ignoreSeriesCode?) {
    const url = getRequestUrl('categories', catId) + '/series';
    const params = {
      rows: 15,
      sort: 'seriesDate',
      dir: 'desc',
    };
    if (ignoreSeriesCode) {
      params['ignoreSeries'] = ignoreSeriesCode;
    }

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getCategoryWorks(catId, ignoreWorkId?) {
    const url = getRequestUrl('categories', catId) + '/works';
    const onSaleTo = getCalculatedDateByDay();
    // const currentContentInfo = getCurrentContentInfo();
    const firstParams = {
      sort: 'onsale',
      dir: 'desc',
      onSaleTo: onSaleTo,
      divisionCode: '9B,9E,29,47,48,89,91,97',
      rows: '15',
      ignoreWork: undefined,
    };
    const secondParams = {
      sort: 'onsale',
      dir: 'desc',
      onSaleTo: onSaleTo,
      ignoreDivisionCode: '9B,9E,29,47,48,89,91,97',
      rows: '15',
      ignoreWork: undefined,
    };

    if (ignoreWorkId) {
      firstParams.ignoreWork = ignoreWorkId;
      secondParams.ignoreWork = ignoreWorkId;
    }

    return this.http.get(url, getHttpOptions(firstParams))
      .switchMap(canadaDivision =>
        this.http.get(url, getHttpOptions(secondParams))
          .map(res => res)
          .map(usDivision => {
            return {
              canadaDivision: canadaDivision,
              usDivision: usDivision,
            };
          })
      );
  }

  getCategoryWorksList(catId, options?) {
    const url = getRequestUrl('categories', catId) + '/works';

    const params = {
      onSaleTo: getCalculatedDateByDay(),
      sort: 'onsale',
      dir: 'desc',
      start: 0,
      rows: 32,
    };

    if (catId === '2000000169') {
      params['zoom'] = 'https://api.penguinrandomhouse.com/title/titles/definition';
    }

    if (options && options.sort) {
      params.sort = options.sort.name;
      params.dir = options.sort.dir;
    }

    if (options && options.next) {
      params.start = options.next;
    }

    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(response => parseFrontlistiestWorkForCategory(response, catId));
  }

  getWorkFormats(workId, activeIsbn) {
    const url = getRequestUrl('works', workId) + '/titles';
    const params = {};

    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(response => parseFormats(response, activeIsbn));
  }

  getWorkImprint(options?, type?, customParams?) {
    const url = getRequestUrl('works');
    const params = {
      sort: 'onsale',
      dir: 'asc',
      start: 0,
      rows: '32',
      divisionCode: '',
      zoom: 'https://api.penguinrandomhouse.com/title/titles/definition',
      imprintCode: options.imprintCode,
      catId: options.subjectCode,
      showReadingGuides: options.showReadingGuides,
      showExcerpt: options.hasExcerpt,
    };
    // only show 8 books in the imprint page fallback grid
    if (customParams) {
      params.rows = customParams;
    }
    if (options && options.sort) {
      params.sort = options.sort.name;
      params.dir = options.sort.dir;
    }

    if (options && options.next) {
      params.start = options.next;
    }
    if (type === 'imprints') {
      return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(response => parseFrontlistiestWork(response, options.imprintCode));
    } else if (type === 'book-club-resources' || type === 'excerpts' ) {
      params.dir = 'desc';
      return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(response => parseNewReleases(response, type));
    }
  }

  getEvent(eventId, params?) {
    const url = getRequestUrl('events', eventId);
    if (params === undefined) {
      params = {};
    }

    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(parseEvent);
  }

  // to make buttons on event details component
  getEventLinks(event) {
    event.links = [];
    // set event external link button
    if (event.referenceUrl
      && isValidUrl(event.referenceUrl)) {
      const eventLink = {
      seoFriendlyUrl: event.referenceUrl,
      label: 'More Details',
      externalFlag: true,
      openWindowFlag: true,
      width: 1200,
      icon: 'globe',
    };
      event.links.push(eventLink);
    }
    // set event map button
    let mapUrl = '';
    if (event.address1) {
      if (!isValidUrl(event.address1)) {
        mapUrl += event.address1;
      }
    }
    if (event.city) {
      mapUrl += event.city;
    }
    if (event.state) {
      mapUrl += event.state;
    }

    mapUrl = 'http://maps.google.com/?q=' + mapUrl.split(' ').join('+');
    const currentLink = {
      seoFriendlyUrl: mapUrl,
      label: 'Get Directions',
      externalFlag: true,
      openWindowFlag: true,
      width: 1200,
      icon: 'map-signs',
    };
      event.links.push(currentLink);
  }

  getEvents(options) {
    // options.location
    const url = getRequestUrl('events');
    const currentContentInfo = getCurrentContentInfo();

    // set event date from
    const curr = new Date();
    const eventFrom = formatDate(curr);

    // set event date to
    const next = new Date();
    next.setFullYear(next.getFullYear() + 1);
    const eventTo = formatDate(next);

    const params = {
      eventDateFrom: eventFrom,
      eventDateTo: eventTo,
      sort: 'eventdate',
      status: 'Confirmed',
      returnEmptyLists: 'true',
      start: 0,
      rows: '10'
    };

    // events by title
    if (options.byContentType) {
      switch (options.byContentType) {
        case 'books':
          params['workId'] = currentContentInfo.id;
          params['zoom'] = 'https://api.penguinrandomhouse.com/title/authors/definition';
          break;

        case 'authors':
          params['authorId'] = currentContentInfo.id;
          break;
      }
    }

    if (options.location) {
      params['state'] = options.location;
    }

    if (options.next) {
      params['start'] = options.next;
    }

    if (options.nextWeek) {
      params.eventDateTo = getCalculatedDateByDay(7);
      // add canadian imprint codes
      params['divisionCode'] = '9B,9E,29,47,48,89,91,97';
    }

    if (options.byContentType === 'events') {
      params['state'] = undefined;
      const firstUrl = getRequestUrl('events', currentContentInfo.id);
      return this.http.get(firstUrl, getHttpOptions({}))
        .switchMap(response => {
          response['data'].map(location => {
            params['state'] = location.state;
          });
          const secondUrl = getRequestUrl('events');
          return this.http.get(secondUrl, getHttpOptions(params))
            .map(res => res)
            .map(parseEvents)
            .catch(errorHandler);
        });
    }

    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(parseEvents);
  }

  getAuthorEvents(type) {
    const url = getRequestUrl() + '/display';
    const params = {};
    let secondUrl;

    // authors
    if (type === 'authors') {
      return this.http
        .get(url, getHttpOptions(params))
        .map(response => response)
        .map(parseAuthorEvents);

    // events
    } else {
      const firstUrl = getRequestUrl();
      return this.http
        .get(firstUrl, getHttpOptions(params))
        .switchMap(event => {
          if (event['data'] && event['data'].length) {
            event['data'].map(author => {
              const authorId = author.authors[0].authorId;
              secondUrl = getRequestUrl('authors', authorId) + '/display';
            });
            return this.http
              .get(secondUrl, getHttpOptions(params))
              .map(response => response)
              .map(parseAuthorEvents);
          }
        }
      );
    }
  }

  getAuthorAllEvents(start, rows) {
    const url = getRequestUrl() + '/events';

    // set event date from
    const curr = new Date();
    const eventFrom = formatDate(curr);

    // set event date to
    const next = new Date();
    next.setFullYear(next.getFullYear() + 1);
    const eventTo = formatDate(next);

    const params = {
      returnEmptyLists: 'true',
      eventDateFrom: eventFrom,
      eventDateTo: eventTo,
      sort: 'eventdate',
      status: 'Confirmed',
      start: start,
      rows: rows,
    };

    return this.http
      .get(url, getHttpOptions(params))
      .map(response => response)
      .map(parseEvents);
  }

  getCategory(catId) {
    // call enhanced api
    const url = getRequestUrl('categories', catId);
    const params = {};

    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(parseCategory);
  }

  getCategoryParent(catId) {
    // call enhanced api
    let url = getRequestUrl('categories', catId) + '/parent';
    const params = {};
    const catIds = [];

    return this.http.get(url, getHttpOptions(params))
      .switchMap(lv1 => {
        if (lv1['data'] && lv1['data'][0].catId !== 2000000000) {
          catIds.push(lv1['data'][0].catId);
          url = getRequestUrl('categories', lv1['data'][0].catId) + '/parent';
        }
        return this.http.get(url, getHttpOptions(params))
          .switchMap(lv2 => {
            if (lv2['data'] && lv2['data'][0].catId !== 2000000000) {
              catIds.push(lv2['data'][0].catId);
              url = getRequestUrl('categories', lv2['data'][0].catId) + '/parent';
            }
            return this.http.get(url, getHttpOptions(params))
            .map(lv3 => {
              if (lv3['data'] && lv3['data'][0].catId !== 2000000000) {
                catIds.push(lv3['data'][0].catId);
                url = getRequestUrl('categories', lv3['data'][0].catId) + '/parent';
              }
              return catIds;
            });
          });
      });
  }

  getCategoryHierarchy(catId) {
    const url = getRequestUrl('categories') + '/hierarchy';
    const params = {
      catId: catId,
      catSetId: 'CN',
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getCategoryChildren(catId) {
    // call enhanced api
    const url = getRequestUrl('categories', catId);
    const params = {};

    return this.http.get(url, getHttpOptions(params))
      .switchMap(category => {
        return this.http.get(url + '/children', getHttpOptions(params))
        .map(children => {
          return {
            category: category,
            children: children,
          };
        });
      });
  }

  getNewReleases(type?, options?) {
    const url = getRequestUrl('works');

    const params = {
      showNewReleases: 'true',
      sort: 'onsale',
      dir: 'desc',
      start: 0,
      rows: '15',
      divisionCode: '9B,9E,29,47,48,89,91,97',
      zoom: 'https://api.penguinrandomhouse.com/title/titles/definition',
      onSaleFrom: undefined,
      onSaleTo: getCalculatedDateByDay()
    };

    switch (type) {
      case 'last-week':
        params.onSaleFrom = getCalculatedDateByDay(-6);
        params.onSaleTo = getCalculatedDateByDay();
        params.rows = '0';
        break;
      case 'last-month':
        // params.sort = 'random';
        params.onSaleFrom = getCalculatedDateByMonth(-1);
        params.onSaleTo = getCalculatedDateByDay(-7);
        params.rows = '32';
        break;
      case 'excerpts':
        params['showExcerpt'] = 'true';
        break;
      case 'book-club-resources':
        params['showReadingGuides'] = 'true';
        break;
    }

    if (options && options.sort) {
      params.sort = options.sort.name;
      params.dir = options.sort.dir;
      params.onSaleTo = getCalculatedDateByDay();
    }

    if (options && options.next) {
      params.start = options.next;
    }

    if (options && options.usDivision) {
      delete params.divisionCode;
      params['ignoreDivisionCode'] = '9B,9E,29,47,48,89,91,97';
    }

    return this.http.get(url, getHttpOptions(params))
      // .map(response => response)
      .map(response => parseNewReleases(response, type));
  }

  getNewReleasesImprints(options?) {
    const url = getRequestUrl('works');

    const params = {
      showNewReleases: 'true',
      sort: 'onsale',
      dir: 'desc',
      start: 0,
      rows: '15',
      divisionCode: '',
      zoom: 'https://api.penguinrandomhouse.com/title/titles/definition',
      onSaleFrom: undefined,
      onSaleTo: getCalculatedDateByDay(),
      imprintCode: options.imprintCode,
    };

    if (options && options.sort) {
      params.sort = options.sort.name;
      params.dir = options.sort.dir;
      params.onSaleTo = getCalculatedDateByDay();
    }

    if (options && options.next) {
      params.start = options.next;
    }

    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(response => parseFrontlistiestWork(response, options.imprintCode));
  }

  getNewReleaseCategory(catId, options?) {
    const url = getRequestUrl('works');

    const params = {
      showNewReleases: 'true',
      sort: 'onsale',
      dir: 'desc',
      start: 0,
      rows: '15',
      zoom: 'https://api.penguinrandomhouse.com/title/titles/definition',
      onSaleFrom: undefined,
      onSaleTo: getCalculatedDateByDay(),
      catSetId: 'CN',
      catId: catId,
      divisionCode: '9B,9E,29,47,48,89,91,97',
    };

    if (options && options.usDivision) {
      return this.http.get(url, getHttpOptions(params))
        .switchMap(canRes => {
          let data = [];
          if (canRes['data'] && canRes['data'].length) {
            data = canRes['data'];
          }

          delete params.divisionCode;
          params['ignoreDivisionCode'] = '9B,9E,29,47,48,89,91,97';

          return this.http.get(url, getHttpOptions(params))
            .map(usRes => {
              if (usRes['data'] && usRes['data'].length) {
                usRes['data'].map(work => {
                  if (data.length < 15) {
                    data.push(work);
                  }
                });
              }
              return {data: data};
            });
        });
      } else {
        return this.http.get(url, getHttpOptions(params))
          .map(response => response);
      }

  }

  getComingSoon(type?, options?) {
    const url = getRequestUrl('works');

    const params = {
      showComingSoon: 'true',
      sort: 'onsale',
      dir: 'asc',
      start: 0,
      rows: '15',
      divisionCode: '9B,9E,29,47,48,89,91,97',
      zoom: 'https://api.penguinrandomhouse.com/title/titles/definition',
      onSaleFrom: getCalculatedDateByDay(),
      onSaleTo: undefined,
      imprintCode: undefined,
    };

    switch (type) {
      case 'next-week':
        params.onSaleFrom = getCalculatedDateByDay();
        params.onSaleTo = getCalculatedDateByDay(7);
        params.rows = '0';
        break;
      case 'next-month':
        // params.sort = 'random';
        params.onSaleFrom = getCalculatedDateByDay(7);
        params.onSaleTo = getCalculatedDateByMonth(1);
        params.rows = '32';
        break;
      case 'excerpts':
        params['showExcerpt'] = 'true';
        break;
      case 'book-club-resources':
        params['showReadingGuides'] = 'true';
        break;
      case 'imprints':
        params.imprintCode = options.imprintCode;
    }

    if (options && options.sort) {
      params.sort = options.sort.name;
      params.dir = options.sort.dir;
      params.onSaleFrom = getCalculatedDateByDay();
    }

    if (options && options.next) {
      params.start = options.next;
    }

    if (options && options.usDivision) {
      return this.http.get(url, getHttpOptions(params))
        .switchMap(canRes => {
          let data = [];
          if (canRes['data'] && canRes['data'].length) {
            data = canRes['data'];
          }

          delete params.divisionCode;
          params['ignoreDivisionCode'] = '9B,9E,29,47,48,89,91,97';

          return this.http.get(url, getHttpOptions(params))
            .map(usRes => {
              if (usRes['data'] && usRes['data'].length) {
                usRes['data'].map(work => {
                  if (data.length < 15) {
                    data.push(work);
                  }
                });
              }
              return {data: data};
            })
            .map(response => parseNewReleases(response, type));
        });
    } else {
      return this.http.get(url, getHttpOptions(params))
        .map(response => parseNewReleases(response, type));
    }
  }

  // Coming Soon slider for Imprints
  getComingSoonImprints(options?) {
    const url = getRequestUrl('works');

    const params = {
      // showComingSoon: 'true',
      sort: 'onsale',
      dir: 'asc',
      start: 0,
      rows: '15',
      divisionCode: '',
      zoom: 'https://api.penguinrandomhouse.com/title/titles/definition',
      onSaleFrom: getCalculatedDateByDay(),
      onSaleTo: undefined,
      imprintCode: options.imprintCode,
    };

    if (options && options.sort) {
      params.sort = options.sort.name;
      params.dir = options.sort.dir;
      params.onSaleFrom = getCalculatedDateByDay();
    }

    if (options && options.next) {
      params.start = options.next;
    }
    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(response => parseFrontlistiestWork(response, options.imprintCode));
  }

  getComingSoonCategory(catId, options?) {
    const url = getRequestUrl('works');

    const params = {
      showComingSoon: 'true',
      sort: 'onsale',
      dir: 'asc',
      start: 0,
      rows: '15',
      zoom: 'https://api.penguinrandomhouse.com/title/titles/definition',
      onSaleFrom: getCalculatedDateByDay(),
      onSaleTo: undefined,
      format: undefined,
      catSetId: 'CN',
      catId: catId,
      divisionCode: '9B,9E,29,47,48,89,91,97',
    };

    if (options && options.usDivision) {
      return this.http.get(url, getHttpOptions(params))
        .switchMap(canRes => {
          let data = [];
          if (canRes['data'] && canRes['data'].length) {
            data = canRes['data'];
          }

          delete params.divisionCode;
          params['ignoreDivisionCode'] = '9B,9E,29,47,48,89,91,97';

          return this.http.get(url, getHttpOptions(params))
            .map(usRes => {
              if (usRes['data'] && usRes['data'].length) {
                usRes['data'].map(work => {
                  if (data.length < 15) {
                    data.push(work);
                  }
                });
              }
              return {data: data};
            });
        });
    } else {
      return this.http.get(url, getHttpOptions(params))
        .map(response => response);
    }
  }

  getAuthor(authorId, method?, options?) {
    // call enhanced api
    let url = '';
    let params = {};

    if (Array.isArray(authorId)) {
      url = getRequestUrl('authors');
      params['authorId'] = authorId.join(',');
      params['rows'] = '0';
    } else {
      url = getRequestUrl('authors', authorId);
    }

    // for books by author component.
    // decide if we want a separate funciton for this.
    if (method) {
      url += '/' + method;

      switch (method) {
        case 'works':
          params = {
            sort: 'onsale',
            dir: 'desc',
          };
          if (options && options.ignoreContribRole) {
            params['ignoreContribRole'] = 'A,I';
            params['rows'] = '15';
          } else {
            params['contribRoleCode'] = 'A,I';
            params['rows'] = '0';
          }
          break;

        case 'series':
          params = {
            sort: 'seriesDate',
            dir: 'desc',
            rows: '15',
          };
          break;
      }
    }

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getAuthors(type?, options?) {
    // call enhanced api
    const url = getRequestUrl('authors') + '/list-display';
    const params = {
      authorLastInitial: 'a',
      contribRoleCode: 'A',
      divisionCode: '9B,9E,29,47,48,89,91,97',
      sort: 'authorLast',
      dir: 'asc',
      start: 0,
      rows: '32',
      imprintCode: '',
    };

    if (options && options.lastName) {
      params.authorLastInitial = options.lastName;
    }

    if (options && options.sort) {
      params.sort = options.sort.name;
      params.dir = options.sort.dir;
    }

    if (options && options.next) {
      params.start = options.next;
    }
    switch (type) {
      case 'imprints':
        params.divisionCode = '';
        params.imprintCode = getCurrentContentInfo().id;
        break;
    }
    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(parseAuthors);
  }

  getAboutAuthor(type, id) {
    let url;
    let params = {};
    let secondUrl;

    if (type === 'books') {
      url = getRequestUrl('authors');
      params = {
        isbn: id,
        contribRoleCode: 'A,I',
        zoom: 'https://api.penguinrandomhouse.com/title/titles/content/definition,'
        + 'https://api.penguinrandomhouse.com/title/works/definition',
        rows: '15',
        sort: 'onsale',
        dir: 'desc',
        suppressLinks: 'false',
      };

      return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(getContributorsOfTitle);
      // for events: get current event, then get author
    } else if (type === 'events') {
      url = getRequestUrl(type, id);
       return this.http.get(url, getHttpOptions(params))
      .switchMap(events => {
        events['data'].map(event => {
          const authorId = event.authors[0].authorId;
          secondUrl = getRequestUrl('authors', authorId) + '/display';
        });
        return this.http.get(secondUrl, getHttpOptions(params))
        .map(response => response)
        .map(getContributorsOfTitle);
      });
    }
  }

  getAuthorsOnTour() {
    // call enhanced api
    const url = getRequestUrl('authors') + '/list-display';
    const params = {
      onTour: 'true',
      contribRoleCode: 'A,I',
      divisionCode: '9B,9E,29,47,48,89,91,97',
      ignoreAuthor: '4639,61866', // Raymond Chandler, Nelson Mandella
      sort: 'random',
      rows: '15'
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(parseAuthors);
  }

  getAuthorsNewRelease() {
    // call enhanced api
    const url = getRequestUrl('authors') + '/list-display';

    // get the date of 7days ago.
    const curr = new Date();
    curr.setDate(curr.getDate() - 7);
    const onSaleFrom = formatDate(curr);

    // get today's date
    const next = new Date();
    const onSaleTo = formatDate(next);

    const params = {
      showNewReleases: 'true',
      contribRoleCode: 'A,I',
      divisionCode: '9B,9E,29,47,48,89,91,97',
      onSaleFrom: onSaleFrom,
      onSaleTo: onSaleTo,
      sort: 'random',
      rows: '0'
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(parseAuthors);
  }

  hasAuthorPhoto(authorId) {
    const url = getRequestUrl('authors', authorId) + '/display';
    return this.http.get(url)
      .map(res => {
        if (res['data'] && res['data'][0].hasAuthorPhoto) {
          return res['data'][0].photo;
        } else {
          return false;
        }
      });
  }

  getImprint(imprintCode) {
    // call enhanced api
    const url = getRequestUrl('imprints', imprintCode);
    const params = {};

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getRelatedRecipes(isbn, excludeNid?) {
    // call enhanced api
    const url = '/jsonapi/node/recipe/';
    const params = {
      '_format': 'api_json',
      'filter[bookFilter][condition][path]': 'field_related_books',
      'filter[bookFilter][condition][value]': isbn,
      'filter[statusFilter][condition][path]': 'status',
      'filter[statusFilter][condition][value]': '1',
      'page[limit]': '15',
      'sort[sort-published][direction]': 'DESC',
      'sort[sort-published][path]': 'created',
      'include': 'field_image,field_meta_image'
    };

    if (excludeNid) {
      params['filter[nidFilter][condition][path]'] = 'nid';
      params['filter[nidFilter][condition][operator]'] = '<>';
      params['filter[nidFilter][condition][value]'] = excludeNid;
    }

    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(parseRecipes);
  }

  getRelatedLinks(linkAttr) {
    let url = getRequestUrl();
    const currentContentInfo = getCurrentContentInfo();
    if (currentContentInfo.type === 'books') {
      url = getRequestUrl('works', currentContentInfo.id);
    }
    url += '/weblinks';

    const params = {
      linkAttr: linkAttr,
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => parseRelatedLinks(response, linkAttr));
  }

  getEventWorks(event) {
    const firstUrl = getRequestUrl('events') + `/${event}/works`;
    const params = {
      workId: undefined,
    };

    return this.http.get(firstUrl, getHttpOptions({}))
      .switchMap(currentEvent => {
        if (currentEvent['data'] && currentEvent['data'].length) {
          params.workId = currentEvent['data'][0].workId;
          const secondUrl = getRequestUrl('works') + `/${params.workId}/display`;
          return this.http.get(secondUrl, getHttpOptions({}))
          .map(res => {
            if (res['data'] && res['data'].length) {
                return res;
            }
         });
       }
    });
  }

  getSeriesWorks(seriesCode) {
    const url = getRequestUrl('works') + '/series-display';
    const params = {
      showCovers: 'true',
      sort: 'onsale',
      dir: 'desc',
      rows: '3',
      seriesCode: seriesCode,
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getSeriesCategories(numbered?) {
    const url = getRequestUrl() + '/categories';
    const params = {
      catSetId: 'CN',
      hasSeriesNumber: 'true',
    };

    if (numbered || numbered === false) {
      params.hasSeriesNumber = numbered;
    }

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getTitleSeriesWorks(options?) {
    const currentContentInfo = getCurrentContentInfo();
    let firstUrl = getRequestUrl() + '/series';
    if (currentContentInfo.type === 'series') {
      firstUrl = getRequestUrl();
    }
    const secondUrl = getRequestUrl('works') + '/series-display';
    const params = {
      sort: 'onsale',
      dir: 'desc',
      start: '0',
      rows: '15',
      seriesCode: undefined,
    };

    if (options) {
      if (options.hasSeriesNumber) {
        params['hasSeriesNumber'] = 'true';
        params.sort = 'seriesNumber';
        params.rows = '32';
      } else {
        params['hasSeriesNumber'] = 'false';
        params.rows = '32';
      }

      if (
        options.sort &&
        (options.sort.name || options.sort.dir)
      ) {
        params.sort = options.sort.name;
        params.dir = options.sort.dir;
      }

      if (options.next) {
        params.start = options.next;
      }
    }

    return this.http.get(firstUrl, getHttpOptions({}))
      .switchMap(series => {
        if (series['data'] && series['data'].length) {
          params.seriesCode = series['data'][0].seriesCode;
        }
        return this.http.get(secondUrl, getHttpOptions(params))
          .map(works => {
            return {
              series: series,
              works: works,
            };
          });
        }
      )
      .map(parseSeriesWorks);
  }

  getSeries() {
    const url = getRequestUrl();

    return this.http
      .get(url, getHttpOptions({}))
      .map(response => response);
  }

  getSeriesAuthors() {
    const firstUrl = getRequestUrl();
    const secondUrl = firstUrl + '/authors';
    const params = {
      contribRoleCode: 'A',
      showBio: 'true',
      hasSeriesNumber: 'true',
      zoom: 'https://api.penguinrandomhouse.com/title/titles/content/definition',
    };

    return this.http.get(firstUrl, getHttpOptions({}))
      .switchMap(series => {
        return this.http.get(secondUrl, getHttpOptions(params))
          .map(authors => {
            return {
              series: series,
              authors: authors,
            };
          });
        }
      );
  }

  getSeriesByCategory(type?) {
    // generate api url
    let url = getRequestUrl();
    const params = {
      returnEmptyLists: 'true',
      // catSeq: '1,2,3,4',
      // catSetId: 'CN',
    };
    if (type === 'series') {
      url += '/categories';
      params['catSetId'] = 'CN';
    }

    return this.http.get(url, {params})
      .map(response => response);
  }

  getFeaturedBook() {
    const url = getRequestUrl() + '/titles';
    const newReleaseParams = {
      rows: '1',
      sort: 'frontlistiest',
      returnEmptyLists: true,
      ignoreFormatFamily: 'audio',
      showNewReleases: 'true',
      onSaleFrom: getCalculatedDateByDay(-90),
      onSaleTo: getCalculatedDateByDay(),
      catSetId: 'CN',
      zoom: 'https://api.penguinrandomhouse.com/title/titles/content/definition,' +
        'https://api.penguinrandomhouse.com/title/authors/definition,' +
        'https://api.penguinrandomhouse.com/title/categories/definition',
    };

    const comingSoonParams = {
      rows: '1',
      sort: 'frontlistiest',
      returnEmptyLists: true,
      ignoreFormatFamily: 'audio',
      showComingSoon: 'true',
      catSetId: 'CN',
      zoom: 'https://api.penguinrandomhouse.com/title/titles/content/definition,' +
        'https://api.penguinrandomhouse.com/title/authors/definition,' +
        'https://api.penguinrandomhouse.com/title/categories/definition',
    };

    return this.http.get(url, getHttpOptions(newReleaseParams))
      .combineLatest(this.http.get(url, getHttpOptions(comingSoonParams)))
      .map(([newRelease, comingSoon]) =>  {
        return {
          newRelease: newRelease,
          comingSoon: comingSoon,
        };
      });
  }


  getPredictiveResult(searchTerm) {
    const url = '/api/enhanced/search/predictive-views/';
    const params = {
      q: searchTerm,
      // docType: 'series, author, work',
      rows : '5',
    };

    return this.http.get(url, {params})
      .map(response => response);

  }

  getSearchResult(params) {
    const url = '/api/enhanced/search/';
    return this.http.get(url, getHttpOptions(params))
      .map(response => parseSearchResult(response, params));
  }
}

export const bannedCategories = [
  2000000045, // Domestic Politics
  2000000162, // World Politics
  2000000157, // US History
  2000000002, // 19th Century U.S. History
  2000000003, // 20th Century U.S. History
  2000000004, // 21st Century U.S. History
  2000000030, // Civil War Period
  2000000033, // Colonial/Revolutionary Period
  2000000108, // Native American History
  2000000128, // Regional & Ethnic Cooking
  2000000139, // Children's Spanish Language Books
  2000000140, // Spanish Language Fiction
  2000000141, // Spanish Language Non-Fiction
  2000000168 // Teen & Young Adult Spanish Language Books
];

/**
 * Convert api filters array to RequestOptions.
 *
 * @param {param} An array of api filters.
 *
 * @return RequestOptions object with api filters in search and default header.
 */
export function getHttpOptions(params?) {
  let httpHeaders = new HttpHeaders();
  httpHeaders = httpHeaders.append('Accept', 'application/vnd.api+json');
  httpHeaders = httpHeaders.append('Content-Type', 'application/vnd.api+json');

  let httpParams = new HttpParams();
  if (params) {
    for (const key in params) {
      if (params[key]) {
        httpParams = httpParams.append(key, encodeURIComponent(params[key]));
      }
    }
  }

  return {
    headers: httpHeaders,
    params: httpParams,
  };
}

/**
 * get response from api call.
 */
export function getResponse(request, callback: (data) => void) {
  return request.subscribe(data => {
    callback(data.json());
  });
}

/**
 * Generate api url by current path or parameters.
 *
 * @param {type} optional parameter for api content type.
 * @param {contentId} optional paramter for api content id.
 *
 * @return A string of api url.
 */
export function getRequestUrl(type?, id?) {
  let url = '/api/enhanced';
  const currentPath = window.location.pathname.split('/');
  const contentType = type ? type : currentPath[1];
  let contentId = id ? id : currentPath[2];

  switch (contentType) {
    case 'books':
      url += '/titles';
      contentId = currentPath[4];
      break;

    case 'recipe':
      url += '/titles';
      break;

    case 'authors':
      url += '/authors';
      break;

    default:
      url += '/' + contentType;
  }

  if ((!type && !id) || (type && id)) {
    url += '/' + contentId;
  }

  return url;
}

/**
 *
 */
export function getCurrentContentInfo() {
  const currentPath = window.location.pathname.split('/');

  return {
    type: currentPath[1] ? currentPath[1] : undefined,
    id: currentPath[2] ? currentPath[2] : undefined,
    name: currentPath[3] ? currentPath[3] : undefined,
    isbn: ['books', 'works'].indexOf(currentPath[1]) > -1 && currentPath[4] ? currentPath[4] : undefined,
    last: currentPath[4] ? currentPath[4] : undefined,
    // for excerpts and reading guides
    bookContent: currentPath[5] ? currentPath[5] : undefined
  };
}

export function parseTitle(response, method?) {
  if (
    method && method === 'awards' &&
    response.data &&
    response.data.length
  ) {
    response.data.map(award => {
      award.label = award.level
      .toLowerCase()
      .split()
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join();
      award.date = award.year !== 0 ? award.year : '';
    });
  }

  return response;
}

export function parseBookAwards(awards) {
  const parsedAwards = [];
  // tslint:disable-next-line:forin
  for (const awardGroup in awards) {
    awards[awardGroup].map(award => {
      award.label = award.level
      .toLowerCase()
      .split()
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join();
      award.date = award.awardYear !== 0 ? award.awardYear : '';

      parsedAwards.push(award);
    });
  }

  return parsedAwards;
}

export function parseFormats(response, activeIsbn) {
  response.data.map((format) => {
    format.title = format.format.description;

    // set selected format
    if (activeIsbn === format.isbn.toString()) {
      format.active = 'mlcl_format-active';
    }

    // set price
    if (format.canPrice) {
      format.subtitle = format.canPrice;
    } else if (format.price && format.price.length) {
      format.price.map((price) => {
        if (price.currencyCode === 'CAD') {
          format.subtitle = price.amount;
        }
      });

      if (isNaN(parseFloat(format.subtitle)) && !isFinite(format.subtitle)) {
        delete format.subtitle;
      }
    } else {
      delete format.subtitle;
    }
  });
  return response;
}

export function parseEvent(response) {
  return response;
}

export function parseEvents(response) {
  if (response.data && response.data.length) {
    response.data.map((event) => {
      // set event location label
      event.label = event.city + ', ' + event.state;
      // set event date
      const eventDateObj = new Date(event.eventDate.replace(/-/g, '\/'));
      event.date = getMonthFormatted(eventDateObj, true);
      event.date += ' ' + getDayRaw(eventDateObj, true);

      // add year if the event is in next year
      const eventYear = getYearRaw(eventDateObj);
      const currentYear = getYearRaw(new Date());
      if (currentYear < eventYear) {
        event.date += ', ' + eventYear;
      }

      // set event title
      let authorDisplay;
      if (event.authors) {
        event.authors.map((author) => {
          authorDisplay = author.display;
        });
      }
      event.location =
        authorDisplay ?
        authorDisplay + ' at ' + event.location :
        event.location;
    });
    return response;
  }
  return {};
}

export function parseCategory(response) {
  return response;
}

export function getContributorsOfTitle(response) {
  const type = getCurrentContentInfo().type;
  if (response && response.data) {
    response.data.map(author => {
      // set accordion variables
      const accordion = {
        id: author.id,
        heading: 'About ' + author.display,
        toggle: false,
        chevron: 'chevron-down',
      };
      author.accordion = accordion;
    // include author bio and works
    if (type === 'events') {
      author.spotlight = author.spotlight;
      author.works = author.works;
    } else {
      author._embeds
      .map(embed => {
        if (embed.content) {
          author.spotlight = embed.content.spotlight;
        }
        if (embed.works) {
          author.works = embed.works;
        }
      });
    }
  });
  return response;
  }
}

export function parseAuthors(response) {
  if (response.data) {
    response.data.map((author) => {
      // for mlcl_slider
      author.title = author.display;

      if (author.hasAuthorPhoto) {
        author.cover = author.photo;
      }

      if (author.authorOf) {
        author.subtitle = '<a '
        + 'href="' + author.authorOf.seoFriendlyUrl
        + '" alt="' + author.authorOf.title + '">'
        + author.authorOf.title + '</a>';
      }
    });
    return response;
  }
  return false;
}

/**
 * parse response data
 */
export function parseNewReleases(response, page?) {
  response.data.map((work) => {
    if (work.format) {
      work.label = work.format.description;
    }

    if (page && page === 'excerpts') {
      work.label = 'Excerpt';
      work.seoFriendlyUrl += '/excerpt';
    } else if (page && page === 'book-club-resources') {
      work.label = 'Reading Guide';
      work.seoFriendlyUrl += '/reading-guide';
    }
  });

  return response;
}

export function parseFrontlistiestWorkForCategory(response, id) {
  if (id === '2000000169') {
    response.data.map(work => {
      const audioFormats = [];

      work._embeds[0].titles.map (title => {
        if (
          title.format.code === 'CD' ||
          title.format.code === 'DN' ||
          title.format.code === 'CS'
        ) {
            audioFormats.push(title);
        }
      });

      // use non audiobook foramt first if exist, if not, use audiobook format
      if (audioFormats.length) {
        work.seoFriendlyUrl = audioFormats[0].seoFriendlyUrl;
        work.cover = 'https://images.randomhouse.com/cover/' + audioFormats[0].isbn;
      }
    });
  }
  return response;
}

/**
 * parse response data for imprints
 */
export function parseFrontlistiestWork(response, id) {
  // audiobook category
  // if (this.enhancedApiService.currentContentId === '2000000169') {
  //   const audioFormats = [];
  //   work._embeds[0].titles.map((title) => {
  //     // filter audiobook formats
  //     if (title.format.code === 'CD'
  //       || title.format.code === 'DN'
  //       || title.format.code === 'CS') {
  //       audioFormats.push(title);
  //     }
  //   });

  //   // parse work data for child component.
  //   if (audioFormats.length) {
  //     work.seoFriendlyUrl = audioFormats[0].seoFriendlyUrl;
  //     work.cover = 'https://images.randomhouse.com/cover/' + audioFormats[0].isbn;
  //   }
  // }

  response.data.map(work => {
    const nonAudioFormats = [];
    const audioFormats = [];

    work._embeds[0].titles.map (title => {
      if (title.imprint.code === id) {
        if (title.format.code !== 'CD'
          && title.format.code !== 'DN'
          && title.format.code !== 'CS') {
          nonAudioFormats.push(title);
        } else {
          audioFormats.push(title);
        }
      }
    });

    // use non audiobook foramt first if exist, if not, use audiobook format
    if (nonAudioFormats.length) {
      work.seoFriendlyUrl = nonAudioFormats[0].seoFriendlyUrl;
      work.cover = 'https://images.randomhouse.com/cover/' + nonAudioFormats[0].isbn;
    } else {
      work.seoFriendlyUrl = audioFormats[0].seoFriendlyUrl;
      work.cover = 'https://images.randomhouse.com/cover/' + audioFormats[0].isbn;
    }
  });
  return response;
}

/**
 * preprocess work data before passing them to 'mlcl-slider-item'
 */
export function setFrontlistestWork(work, type?) {
  if (type &&
    ['new-release', 'coming-soon'].indexOf(type) > -1 &&
    work._embeds) {
    let frontlistestTitle = work._embeds[0].titles[0];

    work._embeds[0].titles.map((title) => {
      const today = new Date();
      const onSaleDate = new Date(title.onsale.replace(/-/g, '/'));

      // new release
      if (type === 'new-release' && onSaleDate <= today) {
        if (frontlistestTitle) {
          const otherOnSaleDate = new Date(frontlistestTitle.onsale.replace(/-/g, '/'));
          frontlistestTitle = otherOnSaleDate < onSaleDate ? title : frontlistestTitle;
        } else {
          frontlistestTitle = title;
        }
      }

      // coming soon
      if (type === 'coming-soon' && onSaleDate > today) {
        if (frontlistestTitle) {
          const otherOnSaleDate = new Date(frontlistestTitle.onsale.replace(/-/g, '/'));
          frontlistestTitle = otherOnSaleDate > onSaleDate ? title : frontlistestTitle;
        } else {
          frontlistestTitle = title;
        }
      }
    });

    work.seoFriendlyUrl = frontlistestTitle.seoFriendlyUrl;
    work.cover = 'https://images.randomhouse.com/cover/' + frontlistestTitle.isbn;
  }

  // parse author for rendering
  if (work.author instanceof Array) {
    const authors = [];
    work.author.map((author) => {
      if (author.roleCode === 'A') {
        authors.push(author.authorDisplay);
      }
    });
    work.author = authors.join(', ');
  }

  return work;
}

export function parseRecipes(response) {
  const sliderItems = [];
  response.data.map((recipe) => {

    const sliderItem = {
      title: '',
      seoFriendlyUrl: '',
      cover: ''
    };
    sliderItem.title = recipe.attributes.title;

    if (recipe.attributes.path) {
      sliderItem.seoFriendlyUrl = recipe.attributes.path.alias;
    } else {
      sliderItem.seoFriendlyUrl = '/node/' + recipe.attributes.nid;
    }

    if (recipe.relationships.field_meta_image.data) {
      sliderItem.cover = getImage(recipe.relationships.field_meta_image.data.id, response.included);
    } else if (recipe.relationships.field_image.data) {
      sliderItem.cover = getImage(recipe.relationships.field_image.data.id, response.included);
    }

    sliderItems.push(sliderItem);
  });
  return sliderItems;
}

export function errorHandler(e) {
  if (e.status >=  500) {
    // return cachedVersion();
  } else {
    return Observable.throw(
      new Error(`${ e.status } ${ e.statusText }`)
    );
  }
}

/**
 * set publishers tag items
 *
 * @param {imprint} api data object that contains an imprint information
 */
export function setPublisher(imprint) {
  const parsedImprints = [];

  parsedImprints.push({
    name: imprint.name,
    seoFriendlyUrl: '/imprints/' + imprint.code
  });

  return parsedImprints;
}

/**
 * set categories tag items
 *
 * @param {categories} api data object that contains a list of categories.
 */
export function setCategories(categories) {
  const parsedCategories = [];

  categories.map((cat) => {
    if (bannedCategories.indexOf(cat.catId) < 0) {
      cat.name = customTitle(cat.catDesc);
      cat.seoFriendlyUrl = '/categories/' + cat.catId + cat.catUri;
      parsedCategories.push(cat);
    }
  });

  return parsedCategories;
}

/**
 * get image url from an array by image uuid.
 *
 * @param {imageId} uuid of field_image
 * @param {included} array of included from jsonapi call
 */
export function getImage(imageId, included) {
  let imageUrl;
  if (!imageId || !included) {
    return imageUrl;
  }

  included.map(item => {
    if (item.id === imageId) {
      imageUrl = item.attributes.url;
    }
  });

  return imageUrl;
}

/**
 * get taxonomy term data from an array by image uuid.
 *
 * @param {fieldId} uuid of field
 * @param {included} array of included from jsonapi call
 */
export function getTaxonomyTerm(fieldId, included, name?) {
  let data;

  if (!fieldId || !included) {
    return data;
  }

  included.map(item => {
    if (item.id === fieldId) {
      data = name ? item.attributes[name] : item.attributes;
    }
  });

  if (name === 'path') {
    return data.alias;
  }
  return data;
}

export function parseRelatedLinks(response, linkAttr) {
  const links = [];
  // for some reasone, the linkAttr filter doesn't work.
  // eg) https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.ca/authors/14498/weblinks?linkAttr=10000
  if (response.data && response.data.length) {
    response.data.map((link) => {
      if (link.linkattr === linkAttr) {
        if (linkAttr === 10000) {
          links.push(link);
        } else {
          links.push({
            externalFlag: true,
            label: 'Website',
            title: link.linktext,
            seoFriendlyUrl: link.url
          });
        }
      }
    });
  }

  return links;
}

export function parseSeriesWorks(response) {
  const series = {
    heading: '',
    headingTag: undefined,
    works: [],
    viewAllUrl: undefined,
    viewAllFlag: false,
    recordCount: 0,
  };
  // get results
  if (
    response.series &&
    response.series.data
  ) {
    response.series.data.map(set => {
      series.viewAllUrl = set.seoFriendlyUrl;
      series.heading = 'More in ';
      series.headingTag = {
        name: set.seriesName,
        seoFriendlyUrl: set.seoFriendlyUrl,
      };
    });
  }

  if (response.data) {
    response['works'] = response;
  }



  if (
    response.works &&
    response.works.data
  ) {
    response.works.data.map(work => {
      if (work.isbn) {
        work.cover = 'https://images.randomhouse.com/cover/' +
        work.isbn;
        work.seoFriendlyUrl += '/' + work.isbn;
      }

      // parse author display
      const authors = [];
      work.author.map(author => {
        if (author.roleCode === 'A' || author.roleCode === 'I') {
          authors.push(author.authorDisplay);
        }
      });

      // TODO: create a exportable funciton for parsing author rendering.
      work.author = authors.join(', ');
    });

    series.works = response.works.data;
    series.recordCount = response.works.recordCount;
    series.viewAllFlag = response.works.recordCount > 15;
  }

  return series;
}

export function parseTitleCategories(response) {
  return response;
}

export function parseFeaturedBooks(resopnse) {
  const results = [];

  resopnse.data.map(title => {
    if (title._embeds && title._embeds.length) {
      title._embeds.map(embed => {
        // contributors array
        if (embed.authors) {
          title.contributors = embed.authors;
        }
        // categories array
        if (embed.categories) {
          title.categories = embed.categories;
        }
        // excerpt
        if (embed.content) {
          title.hasExcerpt = embed.content.excerpt ? true : false;
          title.aboutTheBook = embed.content.positioning ? embed.content.positioning : embed.content.flapcopy;
        }
        // audiobook excerpt???
      });
    }
    results.push(title);
  });

  return results;
}

export function parseFeaturedBook(response) {
  const titles = [response.newRelease, response.comingSoon];
  titles.map((title) => {
    if (title.data && title.data.length) {
      title.data[0].cover = 'https://images.randomhouse.com/cover/' + title.data[0].isbn;
      title.data[0].buttons = [];
      title.data[0].positioning = title.data[0]._embeds[0].content.positioning;

      // add contributors from embeds
      title.data[0]._embeds.map(embed => {
        if (embed.content && embed.content.excerpt) {
          const excerptButton = {
            seoFriendlyUrl: title.data[0].seoFriendlyUrl + '/excerpt',
            label: 'Excerpt',
          };

          title.data[0].buttons.push(excerptButton);
        } else if (embed.authors) {
          title.data[0].contributors = embed.authors;
        } else if (embed.categories) {
          title.data[0].categories = embed.categories;
        } else {
          const readMoreButton = {
            seoFriendlyUrl: title.data[0].seoFriendlyUrl,
            label: 'Read More',
          };
          title.data[0].buttons.push(readMoreButton);
        }
      });
    }
  });

  return {
    newRelease: titles[0],
    comingSoon: titles[1],
  };
}

export function parseAuthorEvents(response) {
  if (response.data && response.data.length) {
    const author = response.data[0];
    let events = {data: []};

    if (author.events && author.events.length) {
      events = parseEvents({data: author.events});
    }

    return {
      heading: 'Events with ' + author.display,
      viewAllFlag: author.events.length >= 10,
      viewAllUrl: author.seoFriendlyUrl + '/events',
      onTourFlag: author.ontour,
      events: events,
    };
  }
  return false;
}

export function parseClientAuthors(authors) {
  const clientAuthors = [];

  for (const id in authors) {
    if (authors[id].works.length > 0) {
      clientAuthors.push(authors[id]);
    }
  }

  return clientAuthors;
}

export function parseAuthorDisplayWorks(work) {
  work.title = work.name;
  work.author = formatContributors(work.authors);

  return work;
}

export function formatContributors(contributors) {
  const formattedContributors = [];
  contributors.map(contributor => {
    if (
      contributor.roleCode === 'A' ||
      contributor.roleCode === 'I'
    ) {
      formattedContributors.push(contributor.display);
    }
  });

  return formattedContributors.join(', ');
}

export function parseSeriesSliderItem(series) {
  series.title = series.seriesName;
  series.code = series.seriesCode;
  return series;
}

/**
* set display format for author names
*/
export function setAuthorNames(work) {
  // filter only for writers
  const authors = [];
  work.authors.map(author => {
    if (author.roleCode === 'A') {
      authors.push(author.display);
    }
  });

  // set display format for author names. eg) "author, author, and author"
  work.author = '';
  // only one author: author
  if (authors.length < 2) {
    work.author = authors[0];
  } else if (authors.length === 2) {
    work.author = authors.join(' and ');
  } else {
    authors.map((author, i) => {
      if (i < authors.length - 2) {
        work.author += author + ', ';
      } else if (i < authors.length - 1) {
        work.author += author + ', and ';
      } else {
        work.author += author;
      }
    });
  }

  return work;
}

 /**
 * Get search term from url.
 */
export function getSearchTerm() {
  const queries = window.location.search.substring(1).split('&');
  let searchTerm = '';
  const filters = {};
  let pageNumber;

  queries.map(query => {
    const queryArr = query.split('=');
    if (queryArr[0] === 'q') {
      queryArr[1] = queryArr[1].replace('+amp+', '&');
      searchTerm = decodeURIComponent(queryArr[1]);
    } else if (queryArr[0] === 'page') {
      pageNumber = queryArr[1];
    } else {
      const key = queryArr[0];
      const val = decodeURIComponent(queryArr[1]);
      filters[key] = val;
    }
  });

  return {
    searchTerm,
    filters,
    pageNumber
  };
}

export function parseSearchResult(response, params) {
  const results = [];
  let suggestions = [];
  let suggestionsCount = 0;
  let facets = {};
  if (response.data) {
    if (
      response.data.results &&
      response.data.results.length
    ) {
      response.data.results.map((result) => {
        result.label = result.docType;
        result.title = result.name;

        if (result.coverUrl) { result.cover = result.coverUrl; }
        if (result.docType === 'isbn') {
          result.cover = 'https://images.randomhouse.com/cover/' + result.key;
          result.label = 'Title';
        }

        if (result.docType === 'author') {
          if (result.hasAuthorPhoto) {
            result.cover = result.authorPhotoUrl;
          }
          result.subtitle = '';
          if (result.authorOf) {
            result.subtitle = 'Author of '
            + '<a href="' + result.authorOf.seoFriendlyUrl
            + '" title="' + result.authorOf.title + '"><i>'
            + result.authorOf.title + '</i></a>';
          }
        }

        if (result.docType === 'event') {
          result.seoFriendlyUrl = '/events/' + result.key;
        }

        results.push(result);
      });
    }

    // get facets
    if (response.data.facets) {
      facets = filterFacets(response.data.facets, params);
    }

    // get suggestions
    if (response.data.suggestions) {
      suggestions = response.data.suggestions;
      suggestionsCount = Object.keys(response.data.suggestions).length;
    }
  }

  //   this.isLoaded = true;
  return {
    results: results,
    recordCount: response.recordCount ? response.recordCount : 0,
    suggestions: suggestions,
    suggestionsCount: suggestionsCount,
    facets: facets,
  };
}

export function filterFacets(facets, params) {
  const parsedFacets = [];
  let dateFacets = [];
  let docTypes = {};
  const selectedFacets = [];

  facets.forEach((facet) => {
    if (facet.name === 'docType') {
      docTypes = facet;
    } else if (
      facet.name === 'comingSoon' ||
      facet.name === 'newRelease'
    ) {
      dateFacets.push(facet);
    } else {
      if (
        !params[facet.name] && Object.keys(facet.values).length > 0 &&
        (facet.name === 'categoryLabel' ||
        facet.name === 'format' ||
        facet.name === 'ageRange' ||
        facet.name === 'eventCityState' ||
        facet.name === 'series' ||
        facet.name === 'imprint')
      ) {
        selectedFacets[facet.name] = facet;
      }
    }
  });

  let dateFacetsFlag = false;
  dateFacets.forEach((dateFacet) => {
    if (dateFacet.values.true) {
      dateFacetsFlag = true;
    }
  });

  if (
    !dateFacetsFlag ||
    params.comingSoon ||
    params.newRelease
  ) {
    dateFacets = [];
  }

  if (selectedFacets['categoryLabel']) { parsedFacets.push(selectedFacets['categoryLabel']); }
  if (selectedFacets['format']) { parsedFacets.push(selectedFacets['format']); }
  if (selectedFacets['ageRange']) { parsedFacets.push(selectedFacets['ageRange']); }
  if (selectedFacets['eventCityState']) { parsedFacets.push(selectedFacets['eventCityState']); }
  if (selectedFacets['series']) { parsedFacets.push(selectedFacets['series']); }
  if (selectedFacets['imprint']) { parsedFacets.push(selectedFacets['imprint']); }

  return {
    facets: parsedFacets,
    dateFacets: dateFacets,
    docTypes: docTypes,
    params: params,
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
  const currentUrl = window.location.pathname;
  const breadcrumbItems = [];
  parentUrl = parentUrl
    ? parentUrl
    : window.location.pathname
        .split('/')
        .splice(-1, 1)
        .join('/');

  // set parent link in breadcrumb
  const parent = {
    name: parentName,
    seoFriendlyUrl: parentUrl,
  };

  // set current link in breadcrumb
  const current = {
    name: currentName,
    seoFriendlyUrl: currentUrl,
  };

  breadcrumbItems.push(parent);
  breadcrumbItems.push(current);

  return breadcrumbItems;
}

export function customTitle(title) {
  if (title && title.toLowerCase() === 'nonfiction') {
    title = 'Non-Fiction';
  }

  return title;
}
