import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
 } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import {
  getCurrentContentInfo,
  getRequestUrl,
  getImage,
  getTaxonomyTerm,
  getContributorsOfTitle,
  errorHandler,
} from './enhanced_api.service';

/**
 * PRHC Drupal content api service.
 */
@Injectable()
export class PrhcApiService {

  constructor(
    private http: HttpClient,
    private _sanitizer: DomSanitizer,
  ) {}

  getEntityId() {
    const currentUrl = window.location.pathname.substring(1);
    const url = '/api/prhc/getEntityId';
    const params = {
      'url': currentUrl,
    };

    return this.http.get(url, getHttpOptions(params));
  }

  getData(url, include?) {
    const params = {
      '_format': 'api_json',
    };
    if (include) {
      params['include'] = include;
    }
    return this.http.get(url, getHttpOptions(params));
  }

  getNodes(type, ids) {
    const url = '/jsonapi/node/' + type;
    const params = {
      '_format': 'api_json',
      // 'filter[status][condition][path]': 'status',
      // 'filter[status][condition][value]': '1',
      'sort[sort-published][path]': 'changed',
      'sort[sort-published][direction]': 'DESC',
      'include': 'field_image,field_meta_image',
      'filter[uuid][condition][path]': 'uuid',
      'filter[uuid][condition][operator]': 'IN',
      'filter[uuid][condition][value][]': ids,
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getCampaignsByCategoryTerm(termLink) {
    return this.http.get(termLink, getHttpOptions({}))
      .switchMap(termData => {
        const secondUrl = '/jsonapi/node/campaign';
        const secondParams = {
          '_format': 'api_json',
          'filter[category][condition][path]': 'field_global_category',
          'filter[category][condition][value]': termData['data'].attributes.tid,
          'filter[status][condition][path]': 'status',
          'filter[status][condition][value]': '1',
          'sort[sort-published][path]': 'changed',
          'sort[sort-published][direction]': 'DESC',
          'page[offset]': '0',
          'page[limit]': '12',
          'include': 'field_image,field_meta_image'
        };

        return this.http.get(secondUrl, getHttpOptions(secondParams))
          .map(res => res)
          .map(campaigns => {
            return {termData, campaigns};
          });
      });
  }

  getPopup(type) {
    const url = '/jsonapi/node/pop_up';
    const currentPath = window.location.pathname;
    const pathSection = currentPath.split('/');

    let multiplePaths = '/';
    if (pathSection[1]) {
      multiplePaths += pathSection[1] + '/*';
    } else {
      multiplePaths += '*';
    }

    const params = {
      '_format': 'api_json',
      'filter[status][condition][path]': 'status',
      'filter[status][condition][value]': '1',
      'filter[typeFilter][condition][path]': 'field_type_of_pop_up',
      'filter[typeFilter][condition][operator]': '=',
      'filter[typeFilter][condition][value]': type,
      'filter[pageFilter][condition][path]': 'field_pages',
      'filter[pageFilter][condition][operator]': 'IN',
      'filter[pageFilter][condition][value][]': ['/*', multiplePaths, currentPath],
      'sort[sort-published][path]': 'changed',
      'sort[sort-published][direction]': 'DESC',
      'page[offset]': '0',
      'page[limit]': '1',
      'include': 'field_image',
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getHomepage() {
    const url = '/jsonapi/node/homepage';
    const params = {
      '_format': 'api_json',
      'filter[status][condition][path]': 'status',
      'filter[status][condition][value]': '1',
      'sort[sort-published][path]': 'changed',
      'sort[sort-published][direction]': 'DESC',
      'page[offset]': '0',
      'page[limit]': '1',
      'include': 'field_category',
    };
    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getHomepageHero() {
    const url = '/jsonapi/node/homepage';
    const params = {
      '_format': 'api_json',
      'filter[status][condition][path]': 'status',
      'filter[status][condition][value]': '1',
      'sort[sort-published][path]': 'changed',
      'sort[sort-published][direction]': 'DESC',
      'page[offset]': '0',
      'page[limit]': '1',
      'include': 'field_hero',
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getImprint(imprintCode) {
    const url = '/jsonapi/node/imprint';
    const params = {
      '_format': 'api_json',
      'filter[status][condition][path]': 'status',
      'filter[status][condition][value]': '1',
      'filter[imprint-code][condition][path]': 'field_imprint_code',
      'filter[imprint-code][condition][value]': imprintCode,
      'sort[sort-published][path]': 'changed',
      'sort[sort-published][direction]': 'DESC',
      'page[offset]': '0',
      'page[limit]': '1',
      'include': 'field_imprint_logo,field_featured_cta,field_image',
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getAllImprints() {
    const url = '/jsonapi/node/imprint';
    const params = {
      '_format': 'api_json',
      'filter[status][condition][path]': 'status',
      'filter[status][condition][value]': '1',
      'sort[sort-published][path]': 'changed',
      'sort[sort-published][direction]': 'DESC',
      'include': 'field_imprint_logo,field_division',
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getHomepageHeroImage(url) {
    return this.http.get(url, getHttpOptions())
      .map(response => response);
  }

  getPreview(contentType, id, include?) {
    const currentUrl = `/jsonapi/node/${contentType}`;
    const firstParams = {
      '_format': 'api_json',
      'filter[uuidFilter][condition][path]': 'uuid',
      'filter[uuidFilter][condition][value]': id,
    };

     if (include) {
        firstParams['include'] = include;
    }
    return this.http.get(currentUrl, getHttpOptions(firstParams))
      .map(res => res)
        .map(article => {
          return {
            article: article
          };
      });
  }

  getNodeForPreview(id) {
    const currentUrl = '/jsonapi/node/homepage';
    const firstParams = {
      '_format': 'api_json',
      'filter[uuidFilter][condition][path]': 'uuid',
      'filter[uuidFilter][condition][value]': id,
    };
    return this.http.get(currentUrl, getHttpOptions(firstParams))
      .map(res => res)
        .map(article => {
          return {
            article: article
          };
      });
  }

  getArticle(include?) {
    const currentUrl = window.location.pathname.substring(1);
    const firstUrl = '/api/prhc/getEntityId';
    const firstParams = {
      'url': currentUrl,
    };

    return this.http.get(firstUrl, getHttpOptions(firstParams))
      .switchMap(nodeInfo => {
        const secondUrl = '/jsonapi/node/' + nodeInfo['data'].type;
        const secondParams = {
          '_format': 'api_json',
          'filter[nidFilter][condition][path]': 'nid',
          'filter[nidFilter][condition][value]': nodeInfo['data'].id,
        };

        if (include) {
          secondParams['include'] = include;
        }

        return this.http.get(secondUrl, getHttpOptions(secondParams))
          .map(res => res)
          .map(article => {
            return {
              nodeInfo: nodeInfo,
              article: article
            };
          });
      });
  }

  getArticles(options?) {
    const currentUrl = window.location.pathname.substring(1);
    const firstUrl = '/api/prhc/getEntityId';
    const firstParams = {
      'url': currentUrl,
    };
    const rows = options && options.rows ? options.rows : 32;

    return this.http.get(firstUrl, getHttpOptions(firstParams))
      .switchMap(nodeInfo => {
        const secondUrl = '/jsonapi/node/article';
        const secondParams = {
          '_format': 'api_json',
          'filter[statusFilter][condition][path]': 'status',
          'filter[statusFilter][condition][value]': 1,
          'include': 'field_image,field_meta_image,field_global_category',
          'sort[sort-published][path]': 'field_date_posted',
          'sort[sort-published][direction]': 'DESC',
          'page[offset]': '0',
          'page[limit]': rows,
        };

        // // category filter
        if (nodeInfo['data'].id) {
          secondParams['filter[categoryFilter][condition][path]'] = 'field_global_category';
          secondParams['filter[categoryFilter][condition][value]'] = nodeInfo['data'].id;
        }

        if (options && options.next) {
          secondParams['page[offset]'] = options.next;
        }

        return this.http.get(secondUrl, getHttpOptions(secondParams))
          .map(res => res)
          .map(article => {
            return {
              nodeInfo: nodeInfo,
              article: article
            };
          });
      });
  }

  getArticlesByCategory(options?) {
    const currentUrl = window.location.pathname.substring(1);
    const firstUrl = '/api/prhc/getEntityId';
    const firstParams = {
      'url': currentUrl,
    };
    const rows = options && options.rows ? options.rows : 32;

    return this.http.get(firstUrl, getHttpOptions(firstParams))
      .switchMap(nodeInfo => {
        let secondUrl = '/api/views/articles-by-category';
        const secondParams = {
          '_format': 'api_json',
          'offset': '0',
          'items_per_page': rows,
        };

        // // category filter
        if (nodeInfo['data'].id) {
          secondUrl += '/' + nodeInfo['data'].id;
        }

        if (options && options.next) {
          secondParams['offset'] = options.next;
        }

        return this.http.get(secondUrl, getHttpOptions(secondParams))
          .map(res => res)
          .map(article => {
            return {
              nodeInfo: nodeInfo,
              article: article
            };
          });
      });
  }

  getArticleHero() {
    const currentUrl = window.location.pathname.substring(1);
    const firstUrl = '/api/prhc/getEntityId';
    const firstParams = {
      'url': currentUrl,
    };

    return this.http.get(firstUrl, getHttpOptions(firstParams))
      .switchMap(nodeInfo => {
        const secondUrl = '/jsonapi/node/' + nodeInfo['data'].type;
        const secondParams = {
          '_format': 'api_json',
          'filter[nidFilter][condition][path]': 'nid',
          'filter[nidFilter][condition][value]': nodeInfo['data'].id,
        };

        if (nodeInfo['data'].type !== 'page') {
          secondParams['include'] = 'field_image,uid';
          secondParams['include'] += nodeInfo['data'].type === 'campaign' ? ',field_campaign_categories' : '';
        }

        return this.http.get(secondUrl, getHttpOptions(secondParams))
          .catch(errorHandler)
          .map(article => {
            return {
              nodeInfo: nodeInfo,
              article: article,
            };
          });
      })
      .map(response => parseArticleHero(response, this._sanitizer));
  }

  getRecipes(options?) {
    const currentUrl = window.location.pathname.substring(1);
    const firstUrl = '/api/prhc/getEntityId';
    const firstParams = {
      'url': currentUrl,
    };
    const rows = options && options.rows ? options.rows : 32;

    return this.http.get(firstUrl, getHttpOptions(firstParams))
      .switchMap(nodeInfo => {
        const secondUrl = '/jsonapi/node/recipe';
        const secondParams = {
          '_format': 'api_json',
          'filter[statusFilter][condition][path]': 'status',
          'filter[statusFilter][condition][value]': 1,
          'include': 'field_image,field_meta_image,field_recipe_categories,field_ingredient_tags',
          'sort[sort-published][path]': 'created',
          'sort[sort-published][direction]': 'DESC',
          'page[offset]': '0',
          'page[limit]': rows,
        };

        // recipe sub landing page
        if (nodeInfo['data'].vid) {
          // recipe categories
          if (nodeInfo['data'].vid === 'recipe_categories') {
            secondParams['filter[categoryFilter][condition][path]'] = 'field_recipe_categories';
          } else {
            secondParams['filter[categoryFilter][condition][path]'] = 'field_ingredient_tags';
          }
          secondParams['filter[categoryFilter][condition][value]'] = nodeInfo['data'].id;
        }

        if (options && options.next) {
          secondParams['page[offset]'] = options.next;
        }

        return this.http.get(secondUrl, getHttpOptions(secondParams))
          .map(res => res)
          .map(article => {
            return {
              nodeInfo: nodeInfo,
              article: article
            };
          });
      });
  }

  getMoreInCategories() {
    const currentUrl = window.location.pathname.substring(1);
    const firstUrl = '/api/prhc/getEntityId';
    const firstParams = {
      'url': currentUrl,
    };
    let categoryFieldName = 'field_global_category';

    return this.http.get(firstUrl, getHttpOptions(firstParams))
      .switchMap(nodeInfo => {
        const secondUrl = '/jsonapi/node/' + nodeInfo['data'].type;
        if (nodeInfo['data'].type === 'recipe') {
          categoryFieldName = 'field_recipe_categories';
        }
        const secondParams = {
          '_format': 'api_json',
          'filter[nidFilter][condition][path]': 'nid',
          'filter[nidFilter][condition][value]': nodeInfo['data'].id,
          'include': categoryFieldName,
        };

        return this.http.get(secondUrl, getHttpOptions(secondParams))
          .map(res => res)
          .map(article => {
            return {
              nodeInfo: nodeInfo,
              article: article
            };
          });
      })
      .map(response => parseArticleCategories(response, categoryFieldName));
  }

  getArticlesInCategory(type, nid, tid, categoryFieldName) {
    const url = '/jsonapi/node/' + type;
    const dateSort =
      type === 'article' ? 'field_date_posted' : 'created';
    const params = {
      '_format': 'api_json',
      'filter[categoryFilter][condition][path]': categoryFieldName,
      'filter[categoryFilter][condition][value]': tid,
      'filter[nidFilter][condition][path]': 'nid',
      'filter[nidFilter][condition][operator]': '<>',
      'filter[nidFilter][condition][value]': nid,
      'filter[statusFilter][condition][path]': 'status',
      'filter[statusFilter][condition][value]': 1,
      'include': 'field_image,field_meta_image',
      'sort[sort-published][path]': dateSort,
      'sort[sort-published][direction]': 'DESC',
      'page[limit]': 15,
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(parseArticlesInCategory);
  }

  getAboutAuthors(type) {
    const currentUrl = window.location.pathname.substring(1);
    const firstUrl = '/api/prhc/getEntityId';
    const firstParams = {
      'url': currentUrl,
    };

    return this.http.get(firstUrl, getHttpOptions(firstParams))
      .switchMap(nodeInfo => {
        const secondUrl = '/jsonapi/node/' + nodeInfo['data'].type;
        const secondParams = {
          '_format': 'api_json',
          'filter[nidFilter][condition][path]': 'nid',
          'filter[nidFilter][condition][value]': nodeInfo['data'].id,
        };
        return this.http.get(secondUrl, getHttpOptions(secondParams))
          .switchMap(articles => {
            let fieldName = 'field_related_authors';
            if (type === 'titles') {
              fieldName = 'field_related_books';
            }

            const ids = [];
            if (articles['data'] && articles['data'].length) {
              if (articles['data'][0].attributes[fieldName]) {
                articles['data'][0].attributes[fieldName].map(id => {
                  if (!isNaN(parseFloat(id)) && isFinite(id)) {
                    ids.push(id);
                  }
                });
              }
            }
            const thirdUrl = getRequestUrl(type);
            const thirdParams = {
              isbn: ids.join(','),
              zoom: 'https://api.penguinrandomhouse.com/title/titles/content/definition',
              suppressLinks: 'false',
            };
            if (type === 'authors') {
              delete thirdParams.isbn;
              thirdParams['authorId'] = ids.join(',');
              thirdParams['contribRoleCode'] = 'A,I';
              thirdParams['zoom'] = 'https://api.penguinrandomhouse.com/title/titles/content/definition,'
             + 'https://api.penguinrandomhouse.com/title/works/definition';
            }

            return this.http.get(thirdUrl, getHttpOptions(thirdParams)).map(getContributorsOfTitle)
              .map(response => {
                if (ids.length === 0) {
                  return null;
                }
                return response;
              });
          });
      });
  }

  getRecipeAboutAuthor() {
    const currentUrl = window.location.pathname.substring(1);
    const firstUrl = '/api/prhc/getEntityId';
    const firstParams = {
      'url': currentUrl,
    };

    return this.http.get(firstUrl, getHttpOptions(firstParams))
      .switchMap(nodeInfo => {
        const secondUrl = '/jsonapi/node/' + nodeInfo['data'].type;
        const secondParams = {
          '_format': 'api_json',
          'filter[nidFilter][condition][path]': 'nid',
          'filter[nidFilter][condition][value]': nodeInfo['data'].id,
        };

        return this.http.get(secondUrl, getHttpOptions(secondParams))
          .switchMap(articles => {
            const ids = [];
            if (articles['data'] && articles['data'].length) {
              if (articles['data'][0].attributes['field_related_books']) {
                articles['data'][0].attributes['field_related_books'].map(id => {
                  if (!isNaN(parseFloat(id)) && isFinite(id)) {
                    ids.push(id);
                  }
                });
              }
            }

            const thirdUrl = getRequestUrl('authors');
            const thirdParams = {
              isbn: ids.join(','),
              zoom: 'https://api.penguinrandomhouse.com/title/titles/content/definition,'
              + 'https://api.penguinrandomhouse.com/title/works/definition',
              suppressLinks: 'false',
            };

            return this.http.get(thirdUrl, getHttpOptions(thirdParams)).map(getContributorsOfTitle)
              .map(response => {
                if (ids.length === 0) {
                  return null;
                }
                return response;
              });
          });
      });
  }

  getRelatedArticles() {
    const currentContentInfo = getCurrentContentInfo();
    const url = '/jsonapi/node/article';
    let params = {};

    if (currentContentInfo.type === 'books') {
      params = {
        'filter[isbn][condition][path]': 'field_related_books',
        'filter[isbn][condition][value]': currentContentInfo.isbn,
        'include': 'field_global_category',
      };
    } else {
      params = {
        'filter[authorId][condition][path]': 'field_related_authors',
        'filter[authorId][condition][value]': currentContentInfo.id,
        'include': 'field_global_category',
      };
    }

    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(parseRelatedArticles);
  }

  getWebforms() {
    const url = '/jsonapi/webform/webform';
    const params = {
      'filter[status][condition][path]': 'status',
      'filter[status][condition][operator]': 'IN',
      'filter[status][condition][value][]': ['scheduled', 'open'],
    };
    return this.http.get(url, getHttpOptions(params))
      .map(response => {
        const webforms = [];
        response['data'].map(webform => {
          webform = webform.attributes;
          webform.seoFriendlyUrl = '/admin/structure/webform/manage/' + webform.title.replace(/\s+/g, '_').toLowerCase() ;
          webform.actions = [
             {
               name: 'Build',
               seoFriendlyUrl: webform.seoFriendlyUrl,
             },
             {
               name: 'Settings',
               seoFriendlyUrl: webform.seoFriendlyUrl + '/settings',
             },
             {
               name: 'Results',
               seoFriendlyUrl: webform.seoFriendlyUrl + '/results/submissions',
             }
          ];
          webforms.push(webform);
        });
        return webforms;
      });
  }

  getWebformElements(webformId) {
    const firstUrl = `/jsonapi/paragraph/webform/${webformId}/field_webform`;
    return this.http.get(firstUrl)
      .switchMap(webform => {
        const id = webform['data'].attributes.id;
        const secondUrl = `/webform_rest/${id}/elements`;
        const params = {
          '_format': 'hal_json'
        };

        return this.http.get(secondUrl, getHttpOptions(params))
        .map(response => {
          response['#webform_attr'] = webform['data'].attributes;
          return response;
        });
      });
  }

  submitWebform(formData) {
    return this.http.get('/session/token', {responseType: 'text'})
      .switchMap(sessionToken => {
        return this.http.post(
          '/webform_rest/submit',
          formData,
          getHttpOptions({'_format': 'hal_json'}, sessionToken)
        ).map(response => response);
      });
  }

  getRetailers(postalCode, isbn) {
    const url = '/jsonapi/node/retailer';
    const params = {
      '_format': 'api_json',
      'filter[status][condition][path]': 'status',
      'filter[status][condition][value]': '1'
    };
    const googleDevKey = 'AIzaSyA42-0Y8oiw4orTskCVreDHd6Zv3PgdK7k';
    const googleApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json' +
      '?address=' + postalCode +
      '&key=' + googleDevKey;

    return this.http
      .get(googleApiUrl)
      .switchMap(geoCoordinates => {
        let province;
        let location;
        let byPass = false;
        if (geoCoordinates['results'][0]) {
          let country;
          const addressType = geoCoordinates['results'][0].types[0];
          // province or city
          if (
            addressType === 'administrative_area_level_1' ||
            addressType === 'locality' ||
            addressType === 'street_address' ||
            addressType === 'postal_code'
          ) {
            geoCoordinates['results'][0].address_components.map(comp => {
              if (comp.types[0] === 'administrative_area_level_1') {
                province = comp.short_name;
              }
              if (comp.types[0] === 'country') {
                country = comp.short_name;
              }
            });
          } else if (addressType === 'country') {
            // return error message
            byPass = true;
          }

          location = geoCoordinates['results'][0];
          location['country_code'] = country;
        }

        if (province || byPass) {
          params['filter[field_address][condition][path]'] = 'field_address.administrative_area';
          params['filter[field_address][condition][value]'] = province;
        }

        return this.http
          .get(url, getHttpOptions(params))
          .switchMap(firstBatch => {
            let httpResp;
            if (firstBatch['links'].next) {
              httpResp = this.http
                .get(firstBatch['links'].next)
                .map(secondBatch => {
                  if (secondBatch['data'] && secondBatch['data'].length) {
                    secondBatch['data'].map(retailer => {
                      firstBatch['data'].push(retailer);
                    });
                  }
                  return firstBatch;
                });
            } else {
              // false calling
              httpResp = this.http
                .get(firstBatch['links'].self)
                .map(secondBatch => {
                  secondBatch['data'] = [];
                  return firstBatch;
                });
            }
            return httpResp.map(results => parseRetailers(results, isbn, location));
          });
      });
  }

  getMainNavItems(navName) {
    const url = '/api/prhc/menu-link-content/' + navName;
    const params = {};

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }

  getListCampaigns() {
    const url = '/jsonapi/node/campaign';
    const params = {
      '_format': 'api_json',
      'filter[categoryFilter][condition][path]': 'field_campaign_categories',
      'filter[categoryFilter][condition][value]': '571',
      'filter[recoFilter][condition][path]': 'field_recommendation_mapping_ter',
      'filter[recoFilter][condition][operator]': 'IS NOT NULL',
      'filter[status][condition][path]': 'status',
      'filter[status][condition][value]': '1',
      'include': 'field_image,field_meta_image,field_recommendation_mapping_ter',
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response)
      .map(parseListCampaigns);
  }

  getBookClubByISBN(isbn) {
    if (!isbn) {
      return null;
    }

    const url = '/jsonapi/node/book_club';
    const params = {
      '_format': 'api_json',
      'filter[status][condition][path]': 'status',
      'filter[status][condition][value]': 1,
      'filter[isbn][condition][path]': 'field_related_books',
      'filter[isbn][condition][value]': isbn,
      'sort[sort-published][path]': 'changed',
      'sort[sort-published][direction]': 'DESC',
      'page[offset]=0&page[limit]': 1,
    };

    return this.http.get(url, getHttpOptions(params))
      .map(response => response);
  }
}

export function parseRelatedArticles(response) {
  const articles = [];

  response.data.map((article) => {
    const category = {
      name: undefined,
      path: undefined,
    };

    if (article.relationships && article.relationships.field_global_category) {
      const categoryUuid = article.relationships.field_global_category.data.id;

      if (response.included && response.included.length) {
        response.included.map((fieldCategory) => {
          if (fieldCategory.attributes.uuid === categoryUuid) {
            category.name = fieldCategory.attributes.name;
            category.path =
              fieldCategory.attributes.path ?
              fieldCategory.attributes.path.alias :
              '/taxonomy/term/' + fieldCategory.attributes.tid;
          }
        });
      }
    }

    const articleItem = {
      title: article.attributes.title,
      body: article.attributes.field_meta_description ? article.attributes.field_meta_description : '',
      seoFriendlyUrl: article.attributes.path ? article.attributes.path.alias : '/node/' + article.attributes.nid,
      category: category,
    };

    articles.push(articleItem);
  });

  return articles;
}

export function parseArticleHero(response, _sanitizer) {
  let article = {};

  if (response.article.data && response.article.data.length) {
    response.article.data.map(node => {
      article = {
        cta: {},
        theme: node.attributes.field_campaign_theme,
        preHeading: node.attributes.field_pre_heading,
        title: node.attributes.title,
        subtitle: node.attributes.field_subtitle,
        introText: undefined,
        authorId: node.attributes.field_author,
        relatedBooks: node.attributes.field_related_books,
        type: response.nodeInfo.data.type,
        coverCaption: undefined,
      };

      if (node.attributes.field_campaign_cta_link) {
        Object.assign(article['cta'], {
          url: node.attributes.field_campaign_cta_link.uri,
          title: node.attributes.field_campaign_cta_link.title,
        });
      }

      if (node.attributes.field_paragraph) {
        article['introText'] = node.attributes.field_paragraph.value;
      } else if (node.attributes.field_paragraph === null && node.attributes.field_intro_text) {
        article['introText'] = node.attributes.field_intro_text;
      }
      if (node.attributes.field_caption && !node.attributes.field_media_credit) {
         article['coverCaption'] =  {
           text: node.attributes.field_caption,
         };
      }

      if (node.attributes.body) {
        article['body'] = _sanitizer.bypassSecurityTrustHtml(node.attributes.body.processed);
      }

      if (
        node.attributes.field_date_posted &&
        node.attributes.field_date_posted_flag
      ) {
        article['published'] = new Date(node.attributes.field_date_posted + '+0000');
      }

      if (node.attributes.field_media_credit) {
        const text = node.attributes.field_media_credit.title
          ? node.attributes.field_media_credit.title
          : '';
        const url = node.attributes.field_media_credit.uri
          ? node.attributes.field_media_credit.uri
          : '';
        article['coverCaption'] = {url, text};
      }

      if (node.relationships.field_image && node.relationships.field_image.data) {
        const imageMeta = node.relationships.field_image.data.meta;
        article['imageUrl'] = imageMeta.derivatives.large.url.replace('/styles/large/public', '');
        article['imageTitle'] = imageMeta.title;
        article['imageAlt'] = imageMeta.alt;
      }
    });
  }

  if (response.article.included && response.article.included.length) {
    response.article.included.map(included => {
      if (included.type === 'taxonomy_term--campaign_categories') {
        article['campaignType'] = included.attributes.name;
      }
    });
  }

  return article;
}

export function parseArticleCategories(response, categoryFieldName) {
  const catIds = [];
  const categories = [];

  if (response.article.data && response.article.data.length) {
    response.article.data.map(article => {
      if (article.relationships[categoryFieldName].data) {
        if (
          Array.isArray(article.relationships[categoryFieldName].data)
        ) {
          article.relationships[categoryFieldName].data.map(cat => {
            if (catIds.length < 2) {
              catIds.push(cat.id);
            }
          });
        } else {
          catIds.push(
            article.relationships[categoryFieldName].data.id,
          );
        }

        catIds.map(catId => {
          response.article.included.map(included => {
            if (included.id === catId) {
              included.attributes.categoryFieldName = categoryFieldName;
              categories.push(included.attributes);
            }
          });
        });
      }
    });
  }

  return {
    nodeInfo: response.nodeInfo.data,
    categories: categories,
  };
}

export function parseArticlesInCategory(response) {
  const sliderItems = [];

  if (response.data && response.data.length) {
    response.data.map(article => {
      const sliderItem = {
        title: article.attributes.title,
        seoFriendlyUrl: '/node/' + article.attributes.nid,
        cover: undefined,
      };

      if (article.attributes.path) {
        sliderItem.seoFriendlyUrl = article.attributes.path.alias;
      }

      if (article.relationships.field_meta_image.data) {
        sliderItem.cover = article.relationships.field_meta_image.data.meta.derivatives.medium.url;
        // sliderItem.cover = getImage(
        //   article.relationships.field_meta_image.data.id,
        //   response.included,
        // );
      } else if (article.relationships.field_image.data) {
        sliderItem.cover = article.relationships.field_image.data.meta.derivatives.medium.url;
        // sliderItem.cover = getImage(
        //   article.relationships.field_image.data.id,
        //   response.included,
        // );
      }

      sliderItems.push(sliderItem);
    });
  }

  return sliderItems;
}

export function getNavTitles(data) {
  const navTitles = [];
  if (data.included && data.included.length) {
    data.included.map((included) => {
      if (included.type === 'paragraph--category_heading'
        && included.attributes.field_nav_title) {
          navTitles.push(included.attributes.field_nav_title);
      }
    });
  }

  return navTitles;
}

export function getCampaignSliderItems(response) {
  const ids = [];
  const isbns = [];
  const authorIds = [];
  const nodes = [];

  if (response['data'] && response['data'].length) {
    response['data'].map(slideItem => {
      if (slideItem.attributes.field_isbn) {
        isbns.push(slideItem.attributes.field_isbn);
        ids.push(slideItem.attributes.field_isbn);
      }

      if (slideItem.attributes.field_author_slider) {
        authorIds.push(slideItem.attributes.field_author_slider);
        ids.push(slideItem.attributes.field_author_slider);
      }

      if (slideItem.relationships && slideItem.relationships.field_content_slider) {
        nodes.push(slideItem.relationships.field_content_slider.data);
        ids.push(slideItem.relationships.field_content_slider.data.id);
      }
    });
  }

  return {ids, isbns, authorIds, nodes};
}

export function getRecipeIntro(response) {
  const recipeIntro = {};

  if (response.data && response.data.length) {
    response.data.map(article => {
      if (article.attributes.field_subtitle) {
        recipeIntro['subheading'] = article.attributes.field_subtitle;
      }

      if (article.attributes.field_introduction) {
        recipeIntro['intro'] = article.attributes.field_introduction.processed;
      }

      if (article.attributes.field_prep_time) {
        recipeIntro['prepTime'] = formattedTime(
          article.attributes.field_prep_time,
        );
      }

      if (article.attributes.field_cook_time) {
        recipeIntro['cookTime'] = formattedTime(
          article.attributes.field_cook_time,
        );
      }
      // related book
      if (article.attributes.field_related_books) {
        recipeIntro['relatedBook'] = article.attributes.field_related_books[0];
      }

      // category
      if (article.relationships.field_recipe_categories.data && response.included) {
        const categories = [];
        article.relationships.field_recipe_categories.data.forEach(cat => {
          const category = getTaxonomyTerm(cat.id, response.included);
          const tag = {
            name: category.name,
            seoFriendlyUrl: '/taxonomy/term/' + category.tid,
          };
          if (category.path) {
            tag.seoFriendlyUrl = category.path.alias;
          }
          categories.push(tag);
        });
        recipeIntro['categories'] = categories;
      }

      // yield from
      if (article.attributes.field_yield_amount) {
        if (article.attributes.field_yield_amount.from) {
          recipeIntro['yieldFrom'] = article.attributes.field_yield_amount.from;
        }
        // yield to
        if (
          article.attributes.field_yield_amount.to
        ) {
          recipeIntro['yieldTo'] = article.attributes.field_yield_amount.to;
        }
      }

      // yield unit
      if (article.relationships.field_units.data && response.included) {
        recipeIntro['yieldUnit'] = getTaxonomyTerm(
          article.relationships.field_units.data.id,
          response.included,
          'name',
        );
      }
    });
  }

  return recipeIntro;
}

export function getRecipeIngredients(response) {
  const ingredients = {};
  const ingredientComponents = [];

  if (response.data && response.data.length) {
    response.data.map(ingredientComponent => {
      // ingredients items
      if (ingredientComponent.relationships.field_ingredients.data) {
        ingredientComponent.relationships.field_ingredients.data.map(item => {
          const ingredient = getTaxonomyTerm(item.id, response.included);

          if (item.type === 'paragraph--inline_image') {
            response.included.forEach(included => {
              if (included.id === item.id) {
                ingredient.relationships = included.relationships;
              }
            });
          }

          if (ingredient.field_ingredients_list) {
            const regexIcon = /<i.*?><\/i>/g;
            ingredient.listField = ingredient.field_ingredients_list.value.replace(
              regexIcon,
              '',
            );
          }

          if (ingredient.field_steps) {
            const regexIcon = /<i.*?><\/i>/g;
            ingredient.listField = ingredient.field_steps.value.replace(
              regexIcon,
              '',
            );
          }

          ingredientComponents.push(ingredient);
        });
      }

      // ingredient tags
      if (ingredientComponent.relationships.field_ingredient_tags.data) {
        const ingredientTags = [];
        ingredientComponent.relationships.field_ingredient_tags.data.map(item => {
          const ingredientTag = getTaxonomyTerm(item.id, response.included);
          const tag = {
            name: ingredientTag.name,
            seoFriendlyUrl: '/taxonomy/term/' + ingredientTag.tid
          };
          if (ingredientTag.path) {
            tag.seoFriendlyUrl = ingredientTag.path.alias;
          }
          ingredientTags.push(tag);
        });
        ingredients['tags'] = ingredientTags;
      }
    });
    ingredients['components'] = ingredientComponents;
  }

  return ingredients;
}

export function getRecipeDirections(response, fieldName) {
  const ingredients = {};
  const ingredientComponents = [];

  if (response.data && response.data.length) {
    response.data.map(ingredientComponent => {
      // ingredients items
      if (ingredientComponent.relationships[fieldName].data) {
        ingredientComponent.relationships[fieldName].data.map(item => {
          const ingredient = getTaxonomyTerm(item.id, response.included);

          if (item.type === 'paragraph--inline_image') {
            response.included.forEach(included => {
              if (included.id === item.id) {
                ingredient.relationships = included.relationships;
              }
            });
          }

          if (ingredient[fieldName]) {
            const regexIcon = /<i.*?><\/i>/g;
            ingredient.listField = ingredient[fieldName].value.replace(
              regexIcon,
              '',
            );
          }

          ingredientComponents.push(ingredient);
        });
      }
    });
    ingredients['components'] = ingredientComponents;
  }

  return ingredients;
}

export function formattedTime(rawTime) {
  const hourMatches = rawTime.match(/(\d*)H/g);
  const hour = hourMatches ? hourMatches[0].split('H')[0] : 0;

  const minuteMatches = rawTime.match(/(\d*)M/g);
  const minute = minuteMatches ? minuteMatches[0].split('M')[0] : 0;

  const secondMatches = rawTime.match(/(\d*)S/g);
  const second = secondMatches ? secondMatches[0].split('S')[0] : 0;

  let hourFomatted = hour > 0 ? hour + ' hour' : '';
  hourFomatted += hour > 1 ? 's ' : hour < 1 ? '' : ' ';

  let minuteFomatted = minute > 0 ? minute + ' minute' : '';
  minuteFomatted += minute > 1 ? 's ' : minute < 1 ? '' : ' ';

  let secondFomatted = second > 0 ? second + ' second' : '';
  secondFomatted += second > 1 ? 's' : '';

  return hourFomatted + minuteFomatted + secondFomatted;
}

export function setPublished(postedDate) {
  let publishedDate: Date;
  if (!isNaN(parseFloat(postedDate)) && isFinite(postedDate)) {
    publishedDate = new Date(postedDate * 1000);
  } else {
    publishedDate = new Date(postedDate);
  }

  const months = [
    'January',
    'Feburary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  const year = publishedDate.getFullYear();
  const month = months[publishedDate.getMonth()];
  const date = publishedDate.getDate();
  const day = days[publishedDate.getDay()];

  return day + ' ' + month + ' ' + date + ', ' + year;
}

export function parseArticles(response) {
  const articles = [];
  let loadMoreFlag = false;
  const recipeCategories = [];

  if (response.article.links.next) {
    loadMoreFlag = true;
  }

  // parse recipe categories
  if (response.article['included']) {
    response.article['included'].map(include => {
      if (include.type === 'taxonomy_term--recipe_categories') {
        const taxonomyCode = include.attributes.tid;
        include.attributes.seoFriendlyUrl = include.attributes.path ?
          include.attributes.path.alias :
          '/taxonomy/term/' + taxonomyCode;
        recipeCategories.push(include.attributes);
      }
    });
  }

  if (response.article['data'] && response.article['data'].length) {
    response.article['data'].map(article => {
      const parsedArticle = {
        title: article.attributes.title,
      };

      if (article.relationships.field_recipe_categories && article.relationships.field_recipe_categories.data) {
        const articleCategories = [];
        article.relationships.field_recipe_categories.data.map(category => {
          recipeCategories.map(recipeCategory => {
            if (category.id === recipeCategory.uuid) {
              articleCategories.push(recipeCategory.name);
            }
          });
        });
        parsedArticle['recipeCategories'] = articleCategories.toString();
      }

      if (article.attributes.field_subtitle) {
        parsedArticle['subtitle'] = article.attributes.field_subtitle;
      }

      if (article.attributes.path) {
        parsedArticle['seoFriendlyUrl'] = article.attributes.path.alias;
      } else {
        parsedArticle['seoFriendlyUrl'] = '/node/' + article.attributes.nid;
      }

      if (article.attributes.field_meta_description) {
        parsedArticle['articleBody'] = article.attributes.field_meta_description;
        parsedArticle['metaDescription'] = article.attributes.field_meta_description;
      }

      // thumbnail image
      if (article.relationships.field_meta_image.data) {
        parsedArticle['cover'] = article.relationships.field_meta_image.data.meta.derivatives.medium.url;
        // parsedArticle['cover'] = getImage(
        //   article.relationships.field_meta_image.data.id,
        //   response.article['included'],
        // );
      } else if (article.relationships.field_image.data) {
        parsedArticle['cover'] = article.relationships.field_image.data.meta.derivatives.medium.url;
        // parsedArticle['cover'] = getImage(
        //   article.relationships.field_image.data.id,
        //   response.article['included'],
        // );
      }

      // category
      if (
        article.relationships.field_global_category &&
        article.relationships.field_global_category.data
      ) {
        const category = getTaxonomyTerm(
          article.relationships.field_global_category.data.id,
          response.article['included'],
        );

        parsedArticle['articleCategories'] = [];
        if (
          (response.nodeInfo['data'].id &&
          category.tid !== response.nodeInfo['data'].id) ||
          !response.nodeInfo['data'].id
        ) {
          parsedArticle['articleCategories'].push({
            name: category.name,
            path: category.path ? category.path.alias : '/taxonomy/term/' + category.tid,
          });
        }
      }

      if (
        article.relationships.field_ingredient_tags &&
        article.relationships.field_ingredient_tags.data
      ) {
        parsedArticle['articleTags'] = [];
        article.relationships.field_ingredient_tags.data.map(ingredientTag => {
          const tag = getTaxonomyTerm(
            ingredientTag.id,
            response.article['included'],
          );
          parsedArticle['articleTags'].push({
            name: tag.name,
            seoFriendlyUrl: tag.path ? tag.path.alias : '/taxonomy/term/' + tag.tid,
          });
        });
      }

      if (article.relationships.field_recipe_categories && article.relationships.field_recipe_categories.data) {
        const articleCategories = [];
        article.relationships.field_recipe_categories.data.map(category => {
          recipeCategories.map(recipeCategory => {
            if (category.id === recipeCategory.uuid) {
              articleCategories.push(recipeCategory);
            }
          });
        });
        parsedArticle['articleTags'] = articleCategories;
      }

      articles.push(parsedArticle);
    });
  }

  return {articles, loadMoreFlag};
}

export function parseArticleByCategory(response) {
  const articles = [];
  let loadMoreFlag = false;

  // parsing here
  if (response.article && response.article.length) {
    // re-define this
    if (response.article.length >= 32) {
      loadMoreFlag = true;
    }

    response.article.map(article => {
      const parsedArticle = {
        title: article.title,
      };

      // subtitle
      if (article.field_subtitle) {
        parsedArticle['subtitle'] = article.field_subtitle;
      }

      // url
      if (article.path) {
        parsedArticle['seoFriendlyUrl'] = article.path;
      } else {
        parsedArticle['seoFriendlyUrl'] = '/node/' + article.nid;
      }

      // Cover image
      if (article.field_meta_image) {
        parsedArticle['cover'] = article.field_meta_image;
      } else if (article.field_image) {
        parsedArticle['cover'] = article.field_image;
      }

      // Meta description
      if (article.field_meta_description) {
        parsedArticle['articleBody'] = article.field_meta_description;
      }

      // global category
      if (article.field_global_category && article.field_global_category_path) {
        parsedArticle['articleCategories'] = [];
        parsedArticle['articleCategories'].push({
          name: article.field_global_category,
          path: article.field_global_category_path,
        });
      }

      articles.push(parsedArticle);
    });
  }

  return {articles, loadMoreFlag};
}

/**
 * Convert api filters array to RequestOptions.
 *
 * @param {param} An array of api filters.
 *
 * @return RequestOptions object with api filters in search and default header.
 */
export function getHttpOptions(params?, sessionToken?) {
  let httpHeaders = new HttpHeaders();
  if (sessionToken) {
    httpHeaders = httpHeaders.append('Accept', 'application/hal+json');
    httpHeaders = httpHeaders.append('Content-Type', 'application/hal+json');
    httpHeaders = httpHeaders.append('X-CSRF-Token', sessionToken);
  } else {
    httpHeaders = httpHeaders.append('Accept', 'application/vnd.api+json');
    httpHeaders = httpHeaders.append('Content-Type', 'application/vnd.api+json');
  }

  let httpParams = new HttpParams();
  if (params) {
    for (const key in params) {
      if (params[key]) {
        if (Array.isArray(params[key])) {
          params[key].map(value => {
            httpParams = httpParams.append(key, value);
          });
        } else {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }
  }

  return {
    headers: httpHeaders,
    params: httpParams,
  };
}

export function parseRetailers(response, isbn, location?) {
  const retailers = [];
  if (response['data'] && response['data'].length) {
    response['data'].map(retailer => {
      let coordinates = {};
      if (retailer.attributes.field_geo_location_info) {
        const geoLocationInfo = JSON.parse(retailer.attributes.field_geo_location_info);
        coordinates = {
          lon: geoLocationInfo.geometry.coordinates[0],
          lat: geoLocationInfo.geometry.coordinates[1],
        };
      }
      let fullAddress = '';
      if (retailer.attributes.field_address.address_line1) {
        fullAddress = retailer.attributes.field_address.address_line1;
      }
      if (retailer.attributes.field_address.locality) {
        fullAddress += ' ' + retailer.attributes.field_address.locality;
      }
      if (retailer.attributes.field_address.administrative_area) {
        fullAddress += ', ' + retailer.attributes.field_address.administrative_area;
      }

      let body = fullAddress;
      if (retailer.attributes.field_phone) {
        body += ' | ' + retailer.attributes.field_phone;
      }
      body += ' | <a href="' +
        'https://maps.google.com/?q=' +
        retailer.attributes.title + ' ' + fullAddress.split(' ').join('+') +
        '" target="_blank" rel="noopener">Get Directions</a>';

      const label = {
        name: undefined,
        path: undefined,
        target: '_blank',
      };

      if (retailer.attributes.field_website) {
          label.name = 'Website';
          label.path = retailer.attributes.field_website.uri;
      }

      if (retailer.attributes.field_webstore) {
        label.name = 'See Availability';
        label.path = 'https://bookmanager.com/' + retailer.attributes.field_webstore +
          '/?q=h.tviewer&using_sb=status&qsb=keyword&searchtype=keyword&qs=' + isbn +
          '&qs_file=';
      }
      if (retailer.attributes.title === 'McNally Robinson') {
        label.name = 'Order Online';
        label.path = 'https://www.mcnallyrobinson.com/' + isbn +
          '/-/-';
      }

      retailers.push({
        nid: retailer.attributes.nid,
        address: retailer.attributes.field_address,
        coordinates: coordinates,
        fullAddress: fullAddress,
        phone: retailer.attributes.field_phone,
        direction: 'https://maps.google.com/?q=' + fullAddress.split(' ').join('+'),
        label: label,
        externalFlag: 'globe',
        title: retailer.attributes.title,
        body: body,
      });
    });
  }

  return {
    data: retailers,
    location: location,
  };
}

export function parseFormElements(elements) {
  const formElements = [];
  elements.map(formElement => {
    if (
      formElement[0].indexOf('#') === -1 &&
      formElement[0] !== 'webform_id'
    ) {
      const element = {
        label: formElement[1]['#title'],
        name: formElement[1]['#name'],
        desc: formElement[1]['#description'],
        input: formElement[1]['#input'],
        required: formElement[1]['#required'],
        type: formElement[1]['#type'],
        children: undefined,
        options: undefined,
        placeholder: undefined,
        class: 'atm_form-' + formElement[1]['#type'],
        value: '',
        valueBoolean: undefined,
        valueArray: []
      };
      // Change label for skill testing question
      if (formElement[1]['#name'] === 'skill_testing_question') {
        element.label = `Skill Testing Question: ${formElement[1]['#title']}`;
      }
      // turn children and select options into arrays
      if (formElement[1]['#webform_composite_elements']) {
        element.children = Object.entries(formElement[1]['#webform_composite_elements']);
        element.children.map(child => {
          if (child[0] === 'country') {
            // restrict country to US and Canada only
            child.options = [
              {
                name: 'United States',
                country: 'US',
              },
              {
                name: 'Canada',
                country: 'CA',
              },
            ];
            child.value = 'CA';
          } else {
            child.value = '';
          }
        });
      }

      // turn select options into arrays
      if (formElement[1]['#options']) {
        element.options = Object.entries(formElement[1]['#options']);
        element.options.map(option => {
          element.valueArray[option[0]] = undefined;
        });
      }

      // create placeholder for email
      if (formElement[1]['#type'] === 'email') {
        element.placeholder = 'example@email.com';
      }

      formElements.push(element);
    }
  });

  return formElements;
}

export function parseNavLinks(response) {
  const navLinks = [];
  if (response.data && response.data.length) {
    response.data.map(link => {
      navLinks.push({
        name: link.attributes.title,
        url: link.attributes.link.uri,
        weight: link.attributes.weight,
      });
    });

    // sort in order of weight
    navLinks.sort(function(a, b) {
      return a.weight - b.weight;
    });
  }

  return navLinks;
}

export function parseCampaignList(campaigns) {
  const parsedCampaignList = [];
  if (campaigns['data']) {
    campaigns['data'].map(campaign => {
      let cover;
      if (
        campaign.relationships.field_meta_image &&
        campaign.relationships.field_meta_image.data
      ) {
        cover = campaign.relationships.field_meta_image.data.meta.derivatives.medium.url;
      } else if (
        campaign.relationships.field_image &&
        campaign.relationships.field_image.data
      ) {
        cover = campaign.relationships.field_image.data.meta.derivatives.medium.url;
      }

      parsedCampaignList.push({
        title: campaign.attributes.title,
        seoFriendlyUrl: campaign.attributes.path
          ? campaign.attributes.path.alias
          : '/node/' + campaign.attributes.nid,
        cover: cover,
      });
    });
  }

  return parsedCampaignList;
}

export function getCoverFromIncluded(included, node) {
  let cover;
  if (
    included &&
    node.relationships.field_meta_image.data &&
    node.relationships.field_meta_image.data.id
  ) {
    const metaImage = included
      .filter(include => include.id === node.relationships.field_meta_image.data.id);

    if (metaImage) {
      cover = metaImage[0].attributes.url;
    }
  } else if (
    included &&
    node.relationships.field_image.data &&
    node.relationships.field_image.data.id
  ) {
    const metaImage = included
      .filter(include => include.id === node.relationships.field_image.data.id);

    if (metaImage) {
      cover = metaImage[0].attributes.url;
    }
  }

  return cover;
}

export function parseListCampaigns(response) {
  const listCampaigns = [];
  if (response['data'] && response['data'].length) {
    response['data'].map(campaign => {
      const recomendationTerms = [];

      if (campaign.relationships) {
        campaign.relationships.field_recommendation_mapping_ter.data.map(recoTerm => {
          recomendationTerms.push(getTaxonomyTerm(recoTerm.id, response.included, 'name'));
        });

        let cover;
        if (campaign.relationships.field_image.data) {
          cover = getImage(
            campaign.relationships.field_image.data.id,
            response.included,
          );
        }

        const listCampaign = {
          title: campaign.attributes.title,
          seoFriendlyUrl:
            campaign.attributes.path ?
            campaign.attributes.path.alias :
            '/node/' + campaign.attributes.nid,
          cover: cover,
          recomendationTerms: recomendationTerms,
          score: 0,
        };

        listCampaigns.push(listCampaign);
      }
    });
  }

  return listCampaigns;
}

export function sortListCampaigns(listCampaigns, recomendationMappingTerms) {
  if (listCampaigns && listCampaigns.length) {
    // rank the list campaigns
    listCampaigns.map(campaign => {
      recomendationMappingTerms.map(term => {
        if (campaign.recomendationTerms.includes(term)) {
          campaign.score += 1;
        }
      });
    });

    // removing non matching list campaigns
    listCampaigns = listCampaigns.filter(campaign => campaign.score > 0);

    // sorting by rank score
    listCampaigns.sort(function(a, b) {
      return b.score - a.score;
    });

    return listCampaigns;
  }
}

