import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import { getHttpOptions } from './prhc_api.service';
import { getRequestUrl } from './enhanced_api.service';

/**
 * PRH Message Web Services api service.
 */
@Injectable()
export class MWSApiService {
  private MWS_API_DEFAULT_SITEID = '210';
  private MWS_API_DEFAULT_PROGRAMID = '21001';


  constructor(protected http: HttpClient) {}

  subscribeServiceWithCategories(userInfo, acqcode, type?) {
    const url = getRequestUrl() + '/categories';
    const params = {
      catSetId: 'CN',
    };

    if (type && type === 'series') {
      params['hasSeriesNumber'] = 'true';
    }

    return this.http.get(url, getHttpOptions(params))
      .switchMap(categories => {
        const mwsUrl = '/api/mws/subscribe';
        const mwsParams = {
          'Email': userInfo.Email,
        };

        const prefsPrefix =
          this.MWS_API_DEFAULT_SITEID + ',' +
          this.MWS_API_DEFAULT_PROGRAMID + ',';

        // CASL
        const prefs = [prefsPrefix + '21026'];

        // Categories
        const prefNames = [];
        if (categories['data'] && categories['data'].length) {
          categories['data'].map(category => {
            const catPrefId = getPrefCodeByCatId(category.catId);
            if (catPrefId) {
              prefs.push(prefsPrefix + catPrefId.id);
              prefNames.push(catPrefId.name);
            }
          });
        }

        mwsParams['Acqcode'] = acqcode;
        mwsParams['Prefs'] = prefs.join(':');
        return this.http
          .get(mwsUrl, getHttpOptions(mwsParams))
          .map(response => {
            return {
              response: response,
              prefNames: prefNames,
            };
          });

      });
  }

  subscribeService(userInfo, acqcode, userPrefs?) {
    const url = '/api/mws/subscribe';
    const params = {
      'Email': userInfo.Email,
    };
    const prefsPrefix =
      this.MWS_API_DEFAULT_SITEID + ',' +
      this.MWS_API_DEFAULT_PROGRAMID + ',';

    if (userInfo.FirstName && userInfo.FirstName.length) {
      params['FirstName'] = userInfo.FirstName;
    }
    if (userInfo.LastName && userInfo.LastName.length) {
      params['LastName'] = userInfo.LastName;
    }

    params['Acqcode'] = acqcode;

    // CASL
    const prefs = [prefsPrefix + '21026'];

    // PRH Canada Events
    if (userInfo.Pc && userInfo.Pc.length) {
      params['Pc'] = userInfo.Pc;
      prefs.push(prefsPrefix + '21049');
    }

    // additional address info
    if (userInfo.Addr1 && userInfo.Addr1.length) {
      params['Addr1'] = userInfo.Addr1;
    }
    if (userInfo.Addr2 && userInfo.Addr2.length) {
      params['Addr2'] = userInfo.Addr2;
    }
    if (userInfo.City && userInfo.City.length) {
      params['City'] = userInfo.City;
    }
    if (userInfo.State && userInfo.State.length) {
      params['State'] = userInfo.State;
    }

    // pre-defined prefCode
    if (userInfo.prefCode) {
      if (Array.isArray(userInfo.prefCode)) {
        userInfo.prefCode.map(pref => {
          prefs.push(prefsPrefix + pref);
        });
      } else {
        prefs.push(prefsPrefix + userInfo.prefCode);
      }
    }

    // Categories
    const catPrefId = getPrefCodeByCatId(userInfo.contentId);
    if (userInfo.contentId && catPrefId) {
      prefs.push(prefsPrefix + catPrefId.id);
    }

    if (userPrefs && userPrefs.length) {
      userPrefs.map(pref => {
        prefs.push(prefsPrefix + pref);
      });
    }

    params['Prefs'] = prefs.join(':');

    return this.http
      .get(url, getHttpOptions(params))
      .map(response => {
        return response;
      });
  }

  getPreferences() {
    const url = '/api/mws/prefs';

    return this.http
      .get(url, getHttpOptions({}))
      .map(response => response);
  }

  /**
   * maping requested data. It returns MCG after subscription.
   *
   * @param {url} The api url for http call.
   *
   * @returns The response api data or null.
   */
  getUserProfile(email) {
    if (!email) {
      return null;
    }

    // set options for http
    const url = '/api/mws/subscribe';
    const secondUrl = '/api/mws/get-profile';

    return this.http
      .get(url, getHttpOptions({'Email': email}))
      .map(response => response)
      .switchMap((profile) => {
        const params = {
          MasterContactGuid: profile['data'].Msg[0].MasterContactGuid
        };
        return this.http.get(secondUrl, getHttpOptions(params))
          .map(response => response);
      });
  }

  getUserProfileWithMcguid(mcguid) {
    // set options for http
    const url = '/api/mws/get-user-profile';

    return this.http
      .get(url, getHttpOptions({MasterContactGuid: mcguid}))
      .map(response => response);
  }

  setUserProfile(mcguid, userProfile, userPrefs, prefs) {
    const url = '/api/mws/set-profile';
    const params = {
      'MasterContactGuid': mcguid,
    };

    if (userProfile.FirstName && userProfile.FirstName.length) {
      params['FirstName'] = userProfile.FirstName;
    }
    if (userProfile.LastName && userProfile.LastName.length) {
      params['LastName'] = userProfile.LastName;
    }
    if (userProfile.Pc && userProfile.Pc.length) {
      params['Pc'] = userProfile.Pc;
    }

    const prefParamsArray = parsePrefParams(this.MWS_API_DEFAULT_PROGRAMID, userPrefs, prefs);

    if (prefParamsArray.length) {
      params['Prefs'] = prefParamsArray.join(':');
    }

    return this.http
      .get(url, getHttpOptions(params))
      .map(response => response);
  }

  setUserProfileUnsubscribe(mcguid) {
    const url = '/api/mws/set-profile';
    const params = {
      'MasterContactGuid': mcguid,
      'Subs': '21001,0',
    };

    return this.http
      .get(url, getHttpOptions(params))
      .map(response => response);
  }
}

export function getPrefCodeByCatId(catId) {
  const categoryPrefIds = {
    '2000000057':	{id: '21005',	name: 'Fiction'},
    '2000000106':	{id: '21006',	name: 'Mystery & Suspense'},
    '2000000054':	{id: '21007',	name: 'Fantasy'},
    '2000000066':	{id: '21008',	name: 'Historical Fiction'},
    '2000000166':	{id: '21009',	name: 'Teen & Young Adult'},
    '2000000021':	{id: '21010',	name: 'Biography & Memoir'},
    '2000000025':	{id: '21011',	name: 'Business'},
    '2000000167':	{id: '21013',	name: 'Humour'},
    '2000000144':	{id: '21014',	name: 'Sports'},
    '2000000036':	{id: '21016',	name: 'Cooking'},
    '2000000122':	{id: '21020',	name: 'Children\'s Picture Books'},
    '2000000100':	{id: '21022',	name: 'Children\'s Middle Grade Books'},
    '2000000115':	{id: '21023',	name: 'Parenting'},
    '2000000029':	{id: '21024',	name: 'Children\'s Books'},
    '2000000131':	{id: '21025',	name: 'Romance'},
    '2000000169':	{id: '21027',	name: 'Audiobooks'},
    '2000000181':	{id: '21028',	name: 'Classics'},
    '2000000062':	{id: '21029',	name: 'Graphic Novels & Manga'},
    '2000000083':	{id: '21030',	name: 'Literary Fiction'},
    '2000000134':	{id: '21031',	name: 'Science Fiction'},
    '2000000190':	{id: '21032',	name: 'Gothic & Horror'},
    '2000000113':	{id: '21033',	name: 'Paranormal Fiction'},
    '2000000170':	{id: '21034',	name: 'Women\'s Fiction'},
    '2000000086':	{id: '21035',	name: 'Merchandise'},
    '2000000111':	{id: '21036',	name: 'Nonfiction'},
    '2000000012':	{id: '21037',	name: 'Arts & Entertainment'},
    '2000000040':	{id: '21038',	name: 'Crafts, Home & Garden'},
    '2000000063':	{id: '21039',	name: 'Health & Fitness'},
    '2000000070':	{id: '21040',	name: 'History'},
    '2000000125':	{id: '21041',	name: 'Politics'},
    '2000000180':	{id: '21042',	name: 'Psychology'},
    '2000000130':	{id: '21043',	name: 'Religion & Philosophy'},
    '2000000136':	{id: '21044',	name: 'Science & Technology'},
    '2000000137':	{id: '21045',	name: 'Self-Improvement'},
    '2000000153':	{id: '21046',	name: 'Travel'},
    '2000000123':	{id: '21047',	name: 'Poetry'},
  };

  return categoryPrefIds[catId];
}

export function parsePrefParams(programId, userPrefs, prefs) {
  const prefParamsArray = [];
  prefs.map(pref => {
    if (
      userPrefs[pref.PreferenceId] ||
      userPrefs[pref.PreferenceId] === false
    ) {
      const status = userPrefs[pref.PreferenceId] ? '1' : '0';
      prefParamsArray.push(programId + ',' + pref.PreferenceId + ',' + status);
    }

    if (pref.PreferenceId === 21051 && pref.SubscriberPrefValues) {
      pref.SubscriberPrefValues.map(sub => {
        const status = userPrefs[pref.PreferenceId][sub.PreferenceKey] ? '1' : '0';
        prefParamsArray.push(
          programId + ',' +
          pref.PreferenceId + ',' +
          status + ',' +
          sub.PreferenceKey + ',' +
          sub.PreferenceText
        );
      });
    }
  });

  return prefParamsArray;
}

export function setAquisitionCode(title) {
  // aquisition code format: RHCANADA_[PAGE-TITLE]_[ACQUISITION-TYPE]_[START_DATE]
  return 'RHCANADA_' + title
            .split(' ')
            .join('-')
            .toUpperCase();
}
