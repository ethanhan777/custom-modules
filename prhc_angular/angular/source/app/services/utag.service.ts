import { Injectable } from '@angular/core';

import { convertTermIDToName } from './segment_api.service';
import { getCurrentContentInfo } from './enhanced_api.service';

@Injectable()
export class TealiumUtagService {
  script_src = '';

  // Typically set "noview" flag (no first page automatic view event) to true for Single Page Apps (SPAs)
  constructor() {
    (<any>window).utag_cfg_ovrd = { noview : true };
    (<any>window).utag_data = {};

    this.setConfig({
      account: 'random',
      profile: 'rh-canada',
      environment: 'prod'
    });
  }

  // Generic script loader with callback
  getScript( src: string, callback: Function ) {
    const d = document;
    const o = { callback: callback || function() {} };
    let s, t;

    if ( typeof src === 'undefined' ) {
      return;
    }

    s = d.createElement('script');
    s.language = 'javascript';
    s.type = 'text/javascript';
    s.async = 1;
    s.charset = 'utf-8';
    s.src = src;

    if ( typeof o.callback === 'function' ) {
      if ( d.addEventListener ) {
        s.addEventListener('load', function() {
          o.callback();
        }, false);
      } else {
        // old IE support
        s.onreadystatechange = function() {
          if (this.readyState === 'complete' || this.readyState === 'loaded' ) {
            this.onreadystatechange = null;
            o.callback();
          }
        };
      }
    }
    t = d.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
  }

  // Config settings used to build the path to the utag.js file
  setConfig(config: {account: string, profile: string, environment: string}) {
    if ( config.account !== undefined && config.profile !== undefined && config.environment !== undefined ) {
      this.script_src = 'https://tags.tiqcdn.com/utag/' + config.account + '/' + config.profile + '/' + config.environment + '/utag.js';
    }
  }

  // Data layer is optional set of key/value pairs
  track(tealium_event: string, data?: any) {
    if ( this.script_src === '' ) {
      console.log('Tealium config not set.');
      return;
    }
    if ( (<any>window).utag === undefined ) {
      this.getScript( this.script_src, function() {
        (<any>window).utag.track( tealium_event, data );
      });
    } else {
      (<any>window).utag.track( tealium_event, data );
    }
  }

  view(data?: any) {
    this.track('view', data);
  }

  link(data?: any) {
    this.track('link', data);
  }
}

export function parseUtagLink(eventType, pageType, title, segments?) {
  const authors = [];
  if (title.contributors) {
    title.contributors.map(contributor => {
      if (contributor.contribRoleCode === 'A') {
        authors.push(contributor.display);
      }
      if (contributor.roleCode === 'A') {
        authors.push(contributor.display);
      }
    });
  }

  const categories = [];
  if (title.categories) {
    title.categories.map(category => {
      categories.push(category.description ? category.description : category.catDesc);
    });
  }

  const $output = {
    'event_type': eventType,
    'product_author': authors.join(' | '),
    'product_title' : title.title,
    'page_type': pageType,
    'product_isbn': title.isbn,
    'product_format': title.format.description ? title.format.description : title.format.name,
    'product_work_id': title.workId,
    'product_imprint': title.imprint.description ? title.imprint.description : title.imprint.name,
    'product_category': categories.join(' | '),

  };

  if (segments) {
    $output['segment_score'] =
    segments.Prob_Seg1 + ' | ' +
    segments.Prob_Seg2 + ' | ' +
    segments.Prob_Seg3 + ' | ' +
    segments.Prob_Seg4 + ' | ' +
    segments.Prob_Seg5 + ' | ' +
    segments.Prob_Seg6;

    $output['segment_score_1'] = segments.Prob_Seg1;
    $output['segment_score_2'] = segments.Prob_Seg2;
    $output['segment_score_3'] = segments.Prob_Seg3;
    $output['segment_score_4'] = segments.Prob_Seg4;
    $output['segment_score_5'] = segments.Prob_Seg5;
    $output['segment_score_6'] = segments.Prob_Seg6;
  }

  return $output;
}

export function parseUtagLinkTitle(title, segments?) {
  const currentContentInfo = getCurrentContentInfo();
  const formatDesc = title.format.name ? title.format.name : title.format.description;
  const imprintDesc = title.imprint.name ? title.imprint.name : title.imprint.description;

  const authors = [];
  if (title.contributors) {
    title.contributors.map(contributor => {
      if (
        (contributor.contribRoleCode && contributor.contribRoleCode === 'A') ||
        (contributor.roleCode && contributor.roleCode === 'A')
      ) {
        authors.push(contributor.display);
      }
    });
  }

  const categories = [];
  if (title.categories) {
    title.categories.map(category => {
      if (category.catDesc) {
        categories.push(category.catDesc);
      } else if (category.description) {
        categories.push(category.description);
      }
    });
  }

  const $output = {
    'event_type': 'buy_button',
    'product_author': authors.join(' | '),
    'product_title' : title.title,
    'page_type': currentContentInfo.type ? currentContentInfo.type : 'Home Page',
    'product_isbn': title.isbn,
    'product_format': formatDesc,
    'product_work_id': title.workId,
    'product_imprint': imprintDesc,
    'product_category': categories.join(' | '),
  };

  if (segments) {
    $output['segment_score'] =
    segments.Prob_Seg1 + ' | ' +
    segments.Prob_Seg2 + ' | ' +
    segments.Prob_Seg3 + ' | ' +
    segments.Prob_Seg4 + ' | ' +
    segments.Prob_Seg5 + ' | ' +
    segments.Prob_Seg6;

    $output['segment_score_1'] = segments.Prob_Seg1;
    $output['segment_score_2'] = segments.Prob_Seg2;
    $output['segment_score_3'] = segments.Prob_Seg3;
    $output['segment_score_4'] = segments.Prob_Seg4;
    $output['segment_score_5'] = segments.Prob_Seg5;
    $output['segment_score_6'] = segments.Prob_Seg6;
  }

  return $output;
}

export function parseUtagLinkForQuiz(allInputs, segment) {
  const genres = [];
  if (allInputs.genres && allInputs.genres.genresCodes) {
    allInputs.genres.genresCodes.map(genre => {
      genres.push(convertTermIDToName(genre));
    });
  }

  let segment_score = '';
  if (segment) {
    segment_score =
    segment.Prob_Seg1 + ' | ' +
    segment.Prob_Seg2 + ' | ' +
    segment.Prob_Seg3 + ' | ' +
    segment.Prob_Seg4 + ' | ' +
    segment.Prob_Seg5 + ' | ' +
    segment.Prob_Seg6;
  }

  return {
    'primary_segment_score': segment && segment.Name ? segment.Name : '',
    'segment_score' : segment_score,
    'segment_score_1': segment && segment.Prob_Seg1 ? segment.Prob_Seg1 : '',
    'segment_score_2': segment && segment.Prob_Seg2 ? segment.Prob_Seg2 : '',
    'segment_score_3': segment && segment.Prob_Seg3 ? segment.Prob_Seg3 : '',
    'segment_score_4': segment && segment.Prob_Seg4 ? segment.Prob_Seg4 : '',
    'segment_score_5': segment && segment.Prob_Seg5 ? segment.Prob_Seg5 : '',
    'segment_score_6': segment && segment.Prob_Seg6 ? segment.Prob_Seg6 : '',
    'genre_preference': genres.join(' | '),
    'books_read': allInputs.quantity ? allInputs.quantity.value : 2,
    'bookclub_preference': allInputs.club ? allInputs.club.value : false,
    'audiobook_preference': allInputs.audio ? allInputs.audio.value : false,
    'fiction_nonfiction_preference': allInputs.fiction ? allInputs.fiction.value : 1,
    'mapped_relationship': allInputs.relationship ? allInputs.relationship.value : '',
    'mapped_profile': allInputs.who ? allInputs.who.value : '',
    'same_author_score': allInputs.allByAuthor ? allInputs.allByAuthor.value : 1,
    'kids_genre_preference': allInputs.kidCategories ? allInputs.kidCategories.join(' | ')  :  '',
    'kids_learn_fun': allInputs.learning ? allInputs.learning.value : '',
    'kids_characters': allInputs.characters ? allInputs.characters.value : '',
  };
}
