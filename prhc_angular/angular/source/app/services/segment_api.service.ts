import { Injectable } from '@angular/core';
import {
  HttpClient,
 } from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { getHttpOptions } from './enhanced_api.service';

/**
 * PRHC Drupal content api service.
 */
@Injectable()
export class SegmentApiService {
  constructor (private http: HttpClient) {}

  getResult(input) {
    const data = {input: []};
    data.input.push(input);

    return this.http
      .get('/api/reco', getHttpOptions({}))
      .switchMap(reco => {
        return this.http
          .get('/api/segment', getHttpOptions({input: JSON.stringify(data)}))
          .map(segment => {
            return {reco, segment};
          });
      });
  }

  getReco() {
    return this.http
      .get('/api/reco', getHttpOptions({}))
      .map(resp => resp);
  }
}

export const categoriesMapping = {
  fiction: [
      {
        name: 'Action & Adventure',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/Adventure@4x.png',
        catId: 2000000189,
        adult: false,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Classics',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/classics@4x.png',
        catId: 2000000181,
        segCode: 'dig_var1',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Fantasy',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/fantasy@4x.png',
        catId: 2000000054,
        segCode: 'dig_var3',
        type: ['Adult'],
        adult: true,
        teenager: false,
        active: undefined,
      },
      {
        name: 'Fantasy',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/fantasy@4x.png',
        catId: 2000000056,
        adult: false,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Graphic Novels & Manga',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/graphic-novels@4x.png',
        catId: 2000000062,
        segCode: 'dig_var4',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Historical Fiction',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/historical-fiction@4x.png',
        catId: 2000000066,
        segCode: 'dig_var5',
        adult: true,
        teenager: false,
        active: undefined,
      },
      {
        name: 'Historical Fiction',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/historical-fiction@4x.png',
        catId: 2000000067,
        adult: false,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Literary Fiction',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/literary-fiction@4x.png',
        catId: 2000000083,
        segCode: 'dig_var6',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Mystery & Suspense',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/mystery-suspense@4x.png',
        catId: 2000000106,
        segCode: 'dig_var7',
        adult: true,
        teenager: false,
        active: undefined,
      },
      {
        name: 'Mystery & Suspense',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/mystery-suspense@4x.png',
        catId: 2000000107,
        adult: false,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Poetry',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/poetry@4x.png',
        catId: 2000000123,
        segCode: 'dig_var31',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Romance',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/romance@4x.png',
        catId: 2000000131,
        segCode: 'dig_var8',
        adult: true,
        teenager: false,
        active: undefined,
      },
      {
        name: 'Romance',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/romance@4x.png',
        catId: 2000000132,
        adult: false,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Science Fiction',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/science-fiction@4x.png',
        catId: 2000000134,
        segCode: 'dig_var9',
        adult: true,
        teenager: false,
        active: undefined,
      },
      {
        name: 'Science Fiction',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/science-fiction@4x.png',
        catId: 2000000135,
        adult: false,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Thrillers',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/thrillers@4x.png',
        catId: 2000000147,
        segCode: 'dig_var11',
        adult: true,
        teenager: false,
        active: undefined,
      },
      {
        name: 'Young Adult Fiction',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/ya@4x.png',
        catId: 2000000166,
        segCode: 'dig_var12',
        adult: true,
        teenager: false,
        active: undefined,
      },
      {
        name: 'All Fiction',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/Fiction@4x.png',
        catId: 2000000057,
        segCode: 'dig_var13',
        adult: true,
        teenager: false,
        active: undefined,
      },
      {
        name: 'All Fiction',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/Fiction@4x.png',
        catId: 2000000058,
        adult: false,
        teenager: true,
        active: undefined,
      }
    ],
    nonFiction: [
      {
        name: 'Arts & Entertainment',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/arts-entertainment@4x.png',
        catId: 2000000012,
        segCode: 'dig_var14',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Biography & Memoir',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/Biography-Memoir@4x.png',
        catId: 2000000021,
        segCode: 'dig_var15',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Business',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/business@4x.png',
        catId: 2000000025,
        segCode: 'dig_var16',
        adult: true,
        teenager: false,
        active: undefined,
      },
      {
        name: 'Cooking',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/cooking@4x.png',
        catId: 2000000036,
        segCode: 'dig_var17',
        adult: true,
        teenager: false,
        active: undefined,
      },
      // {
      //   name: 'Crafts, Home & Garden',
      //   icon: '../../../../../../../../themes/custom/penguin/images/icons/Fiction@4x.png',
      //   catId: 2000000040,
      //   segCode: 'dig_var18',
      // },
      // {
      //   name: 'Games',
      //   icon: '../../../../../../../../themes/custom/penguin/images/icons/Fiction@4x.png',
      //   catId: undefined,
      //   segCode: 'dig_var19',
      // },
      {
        name: 'Health & Fitness',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/health-fitness@4x.png',
        catId: 2000000063,
        segCode: 'dig_var20',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'History',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/history@4x.png',
        catId: 2000000070,
        segCode: 'dig_var21',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Parenting',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/parenting@4x.png',
        catId: 2000000115,
        segCode: 'dig_var22',
        adult: true,
        teenager: false,
        active: undefined,
      },
      // {
      //   name: 'Pets',
      //   icon: '../../../../../../../../themes/custom/penguin/images/icons/Fiction@4x.png',
      //   catId: undefined,
      //   segCode: 'dig_var23',
      // },
      {
        name: 'Politics',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/politics@4x.png',
        catId: 2000000125,
        segCode: 'dig_var24',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Psychology',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/psychology@4x.png',
        catId: 2000000180,
        segCode: 'dig_var25',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Spirituality & Philosophy',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/spirituality-philosophy@4x.png',
        catId: 2000000130,
        segCode: 'dig_var26',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Science & Technology',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/science-tech@4x.png',
        catId: 2000000136,
        segCode: 'dig_var27',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Self Improvement',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/self-improvement@4x.png',
        catId: 2000000137,
        segCode: 'dig_var28',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Social Issues',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/social-issues@4x.png',
        catId: 2000000187,
        adult: false,
        teenager: true,
        active: undefined,
      },
      {
        name: 'Sports',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/sports@4x.png',
        catId: 2000000144,
        segCode: 'dig_var29',
        adult: true,
        teenager: true,
        active: undefined,
      },
      {
        name: 'All Non-Fiction',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/Fiction@4x.png',
        catId: 2000000178,
        adult: false,
        teenager: true,
        active: undefined,
      },
      // {
      //   name: 'Travel',
      //   icon: '../../../../../../../../themes/custom/penguin/images/icons/Fiction@4x.png',
      //   catId: 2000000153,
      //   segCode: 'dig_var30',
      // },
    ],
};

export function filterRecommendation(reco, who) {
  // adult, teen, and child filter
  switch (who) {
    case 'Adult':
      reco = reco.filter(isbn => isbn.ADULT_TITLE === 1);
      break;
    case 'Teenager':
      reco = reco.filter(isbn => isbn.TEEN_TITLE === 1);
      break;
    case 'Child':
      reco = reco.filter(isbn => isbn.KIDS_TITLE === 1);
      break;
  }

  return reco;
}

export function rankRecommendation(reco, segment, ficNfc, categories, audiobook, bookClub) {
  if (segment.Results) {
    reco.map(isbn => {
      // calculate segment total score
      isbn.SEGMENT_TOTAL = 0;
      isbn.SEGMENT_TOTAL += isbn.SEGMENT_1 * segment.Results[0].Prob_Seg1;
      isbn.SEGMENT_TOTAL += isbn.SEGMENT_2 * segment.Results[0].Prob_Seg2;
      isbn.SEGMENT_TOTAL += isbn.SEGMENT_3 * segment.Results[0].Prob_Seg3;
      isbn.SEGMENT_TOTAL += isbn.SEGMENT_4 * segment.Results[0].Prob_Seg4;
      isbn.SEGMENT_TOTAL += isbn.SEGMENT_5 * segment.Results[0].Prob_Seg5;
      isbn.SEGMENT_TOTAL += isbn.SEGMENT_6 * segment.Results[0].Prob_Seg6;

      // category bonus
      categories.map(category => {
        if (isbn['X' + category] > 0) {
          isbn.SEGMENT_TOTAL += 0.75;
        }
      });

      // add bonus scores FIC/NFC, audiobook, and book club
      isbn.SEGMENT_TOTAL += otherBonusScore(
        isbn.SUBJECT_GRP,
        isbn.SEGMENT_TOTAL,
        ficNfc,
        audiobook && isbn.BOOK_CLUB === 1,
        bookClub && isbn.BOOK_CLUB === 1,
        isbn.PRINT_TITLES === 1
      );
    });
  }

  // sorting by segment number
  reco = sortRecomendation(reco);

  return reco;
}

export function sortRecomendation(reco) {
  // sorting by segment number
  reco.sort(function(obj1, obj2) {
    // descending
    return obj2['SEGMENT_TOTAL'] - obj1['SEGMENT_TOTAL'];
  });

  // limite number of isbns to 100 for titles list api.
  reco.splice(100);

  return reco;
}

export function otherBonusScore(
  subjectGroup,
  segmentTotal,
  ficNfc,
  audiobookFlag,
  bookClubFlag,
  printGuideFlag
) {
  // fiction/ non fiction bonus
  switch (ficNfc) {
    case 1:
      if (subjectGroup === 'FIC') {
        segmentTotal += 0.2;
      } else {
        segmentTotal += -0.2;
      }
      break;

    case 2:
      if (subjectGroup === 'FIC') {
        segmentTotal += 0.1;
      } else {
        segmentTotal += -0.1;
      }
      break;

    case 5:
      if (subjectGroup === 'FIC') {
        segmentTotal += -0.1;
      } else {
        segmentTotal += 0.1;
      }
      break;

    case 6:
      if (subjectGroup === 'FIC') {
        segmentTotal += -0.2;
      } else {
        segmentTotal += 0.2;
      }
      break;
  }

  // audiobook bonus
  if (audiobookFlag) {
    segmentTotal += 0.25;
  }

  // book club bonus
  if (bookClubFlag) {
    segmentTotal += 0.25;
  }

  // print guide bonus
  if (printGuideFlag) {
    segmentTotal += 0.1;
  }

  return segmentTotal;
}

export function rankChildRecommendation(reco, kidCategories, age) {
  reco.map(isbn => {
    // calculate segment total score
    isbn.SEGMENT_TOTAL = 0;

    // category bonus
    if (kidCategories && kidCategories.length) {
      kidCategories.map(category => {
        if (isbn[category.toUpperCase()] > 0) {
          isbn.SEGMENT_TOTAL += 1;
        }
      });
    }

    // age bonus
    if (age && isbn['AGES_' + age.split('-').join('_')] > 0) {
      isbn.SEGMENT_TOTAL += 2;
    }
  });

  // sorting by segment number
  reco = sortRecomendation(reco);

  return reco;
}

export function convertTermIDToName(term) {
  let category;
  if (!isNaN(parseFloat(term)) && isFinite(term)) {
    // tslint:disable-next-line:no-use-before-declare
    category = categoriesMapping.fiction.filter(cat => cat.catId === term);

    if (!category || category.length === 0) {
      // tslint:disable-next-line:no-use-before-declare
      category = categoriesMapping.nonFiction.filter(cat => cat.catId === term);
    }
  }

  return category && category[0] ? category[0].name : term;
}

export function setFeaturedCustomHeading(books, preferences, segment?) {
  let matchedHeadings = [];

  // set headings on books
  books.map(book => {
    const topSegment = getTopSegment(book);

    // check to see which headings match
    matchedHeadings = checkMatches(book, preferences, topSegment, segment);

    // select one of the matching headings to display
    if (preferences.who.value === 'Child' && matchedHeadings.length === 0) {
      const currentCategory = getBookKidCategories(book);
      if (currentCategory) {
        book.customHeading = 'This is a great book about ' + currentCategory + ' for kids';
      } else {
        book.customHeading = 'This is a great book for kids';
      }
    } else if (matchedHeadings.length === 0) {
      book.customHeading = 'Check out this great ' + getBookCategories(book) + ' book';
    } else {
      book.customHeading = matchedHeadings[Math.floor(Math.random() * (matchedHeadings.length))];
    }

  });

  return books;
}

export function checkMatches(book, preferences, topSegment, segment?) {
  const matchedHeadings = [];

  // get the written names for the selected genres
  const genres = [];
  if (preferences.genres && preferences.genres.genresCodes.length) {
    genres.push({
      id: preferences.genres.genresCodes[0],
      name: convertTermIDToName(preferences.genres.genresCodes[0]).toLowerCase(),
    });

    if (preferences.genres.genresCodes[1]) {
      genres.push({
        id: preferences.genres.genresCodes[1],
        name: convertTermIDToName(preferences.genres.genresCodes[1]).toLowerCase(),
      });
    }

    if (preferences.genres.genresCodes[2]) {
      genres.push({
        id: preferences.genres.genresCodes[2],
        name: convertTermIDToName(preferences.genres.genresCodes[2]).toLowerCase(),
      });
    }
  }

  // make kid categories lowercase
  const kidCategories = [];
  if (preferences.kidCategories && preferences.kidCategories.length) {
    preferences.kidCategories.map(category => {
      kidCategories.push(category.toLowerCase());
    });
  }
  // set statements
  const statements = {};

  // set preference variables
  const relationship = preferences.relationship.pronoun.toLowerCase();
  const pronoun = relationship === 'you' ? 'you' : 'they';
  const possessive = relationship === 'you' ? 'your' : 'their';
  let possessive2 = relationship === 'you' ? 'your' : relationship + '\'s';

  if (preferences.relationship.value === 'in-laws') {
    possessive2 = relationship === 'you' ? 'your' : relationship + '\'';
  }

  // child specific statements
  if (preferences.who.value === 'Child' && preferences.age.value !== '13-17') {
    // gift guide
    if (book['PRINT_TITLES'] === 1) {
      statements['giftGuideChild'] = 'This is one of our favourite books for kiddos';
      statements['giftGuideChild2'] = 'Staff favourite in ' + getBookKidCategories(book);
      statements['giftGuide2'] = 'Keep an eye on this amazing read';
      statements['giftGuide3'] = `We can't get enough of this book, and we think ${relationship} will love it too`;
    }
    // category
    if (preferences.kidCategories.length) {
      statements['kidCat1A'] = `Picked for ${relationship} because ${pronoun} like ${kidCategories[0]}`;
      statements['kidCat3A'] = `${relationship} will love this book with ${kidCategories[0]}`;
      statements['kidCat4A'] = `This book with ${kidCategories[0]} is a great choice for ${relationship}`;
    }
    if (preferences.kidCategories.length > 1) {
      statements['kidCat1B'] = `Picked for ${relationship} because ${pronoun} like ${kidCategories[1]}`;
      statements['kidCat2'] = `Great for ${relationship} because ${pronoun} like ${kidCategories[0]} and ${kidCategories[1]}`;
      statements['kidCat3B'] = `${relationship} will love this book with ${kidCategories[1]}`;
      statements['kidCat4B'] = `This book with ${kidCategories[1]} is a great choice for ${relationship}`;
    }
    if (preferences.kidCategories.length > 2) {
      statements['kidCat1C'] = `Picked for ${relationship} because ${pronoun} like ${kidCategories[2]}`;
      statements['kidCat3C'] = `${relationship} will love this book with ${kidCategories[2]}`;
      statements['kidCat4C'] = `This book with ${kidCategories[2]} is a great choice for ${relationship}`;
    }
    // learn
    statements['learn1'] = 'Learn more about ' + getBookKidCategories(book);
    statements['learn2'] = 'Learn something new with this book';
    statements['learnFun'] = 'Education and fun all in one';
    // have fun
    statements['fun1'] = 'This book is loads of fun!';
    statements['fun2'] = 'Continue the fun with a book that has ' + getBookKidCategories(book);
    // characters
    statements['characters1'] = `${relationship} can keep reading about ${possessive} favourite characters`;
    statements['characters2'] = `Enjoy ${possessive} favourite characters again and again`;

    // check if matches kids categories
    if (kidCategories.length &&
      book[kidCategories[0].toUpperCase()] === 1) {
      matchedHeadings.push(
        statements['kidCat1A'],
        statements['kidCat3A'],
        statements['kidCat4A'],
      );
    }
    if (kidCategories.length > 1 && book[kidCategories[1].toUpperCase()] === 1) {
      matchedHeadings.push(
        statements['kidCat1B'],
        statements['kidCat3B'],
        statements['kidCat4B'],
      );
    }
    if (kidCategories.length > 2 && book[kidCategories[2].toUpperCase()] === 1) {
      matchedHeadings.push(
        statements['kidCat1C'],
        statements['kidCat3C'],
        statements['kidCat4C'],
      );
    }
    if (kidCategories.length > 1 &&
      book[kidCategories[0].toUpperCase()] === 1 &&
      book[kidCategories[1].toUpperCase()] === 1) {
      matchedHeadings.push(
        statements['kidCat2'],
      );
    }

    // check if matches learn
    if (preferences.learning && preferences.learning.value === 'Learn Something New' && book['LEARN'] === 1 ||
      preferences.learning && preferences.learning.value === 'Both' && book['LEARN'] === 1) {
      matchedHeadings.push(
        statements['learn1'],
        statements['learn2'],
      );
    }

    // check if matches learn AND have fun
    if (preferences.learning && preferences.learning.value === 'Both' && book['LEARN'] === 1 && book['FUN'] === 1) {
      matchedHeadings.push(
        statements['learnFun'],
      );
    }

    // check if matches have fun
    if (preferences.learning && preferences.learning.value === 'Have Fun' && book['FUN'] === 1 ||
      preferences.learning && preferences.learning.value === 'Both' && book['FUN'] === 1) {
      matchedHeadings.push(
        statements['fun1'],
        statements['fun2'],
      );
    }

    // check if matches characters
    if (preferences.characters && preferences.characters.value === 'Yes' && book['SERIES'] === 1) {
      matchedHeadings.push(
        statements['characters1'],
        statements['characters2'],
      );
    }
      // check if in gift guide
  if (book['PRINT_TITLES'] === 1) {
    matchedHeadings.push(
      statements['giftGuide2'],
      statements['giftGuide3'],
      statements['giftGuideChild'],
      statements['giftGuideChild2'],
    );
  }
  } else {
    // teen and adult only statements
    // genres statements
    if (genres.length) {
      statements['genre1A'] =
        'Picked for ' + relationship + ' because ' + pronoun +
        ' like ' + genres[0].name;
      statements['genre4A'] = `This ${genres[0].name} book is a great choice for ${relationship}`;
      statements['genre5A'] = `This book is perfeft for a ${genres[0].name} reader`;
      statements['segmentGenre2'] = 'Readers like ' + relationship + ' also like ' + genres[0].name;
      statements['genreBookClub'] = 'Here\'s a ' + genres[0].name + ' book you can talk about with ' + possessive + ' friends';
      statements['genreGuide1A'] = `Here's a ${genres[0].name} book ${relationship} can talk about with ${pronoun} friends`;
    }
    if (genres.length > 1) {
      statements['genre1B'] =
        'Picked for ' + relationship + ' because ' + pronoun +
        ' like ' + genres[1].name;
      statements['genre4B'] = `This ${genres[1].name} book is a great choice for ${relationship}`;
      statements['genre5B'] = `This book is perfeft for a ${genres[1].name} reader`;
      statements['genre2'] =
        'Great for ' + relationship + ' because ' + pronoun +
        ' like ' + genres[0].name + ' and ' + genres[1].name;
      statements['genreBookClub2'] = 'Here\'s a ' + genres[1].name + ' book you can talk about with ' + possessive + ' friends';
      statements['genreGuide1B'] = `Here's a ${genres[1].name} book ${relationship} can talk about with ${pronoun} friends`;
    }
    if (genres.length > 2) {
      statements['genre1C'] =
        'Picked for ' + relationship + ' because ' + pronoun +
        ' like ' + genres[2].name;
      statements['genre4C'] = `This ${genres[2].name} book is a great choice for ${relationship}`;
      statements['genre5C'] = `This book is perfeft for a ${genres[2].name} reader`;
      statements['genre3'] =
        'Picked for ' + relationship + ' because ' + pronoun +
        ' like ' + genres[0].name + ', ' + genres[1].name + ', and ' + genres[2].name;
      statements['genreBookClub3'] = 'Here\'s a ' + genres[2].name + ' book you can talk about with ' + possessive + ' friends';
      statements['genreGuide1C'] = `Here's a ${genres[2].name} book ${relationship} can talk about with ${pronoun} friends`;
    }

    statements['giftGuide'] = 'Staff favourite in ' + getBookCategories(book);
    statements['segment1'] = 'Readers similar to ' + relationship + ' liked this book';
    statements['segment2'] = `This book is made for ${relationship}`;
    statements['segmentGenre1'] = 'We think this will be ' + possessive2 + ' next favourite';
    // staff pick and segment statements
    if (book['PRINT_TITLES'] === 1) {
      statements['segmentPick1'] = `We think this is a book ${relationship} won't want to miss`;
      statements['segmentPick2'] = `${relationship} will want to read this ` + getBookCategories(book) + ` book next`;
    }
    // other statements
    statements['bookClub1'] = 'This book is great for book clubs';
    statements['bookClub2'] = 'Check out the reading guide for ' + possessive2 + ' next book club pick!';
    statements['bookClub3'] = `${relationship} should get ready to discuss this read with friends`;
    statements['bookClubAudio'] = 'Try an audiobook for your next book club pick!';
    statements['audiobooks1'] = 'Listen to this audiobook next';
    statements['audiobooks2'] =
      relationship === 'you' ?
      'Listen to this on your next road trip' :
      relationship + ' can listen to this on their next road trip';
    statements['giftGuide2'] = 'Keep an eye on this amazing read';
    statements['giftGuide3'] = `We can't get enough of this book, and we think ${relationship} will love it too`;

    // Check if matched segment only
    if (
      segment &&
      topSegment.key === `SEGMENT_${segment}`
    ) {
      matchedHeadings.push(
        statements['segment1'],
        statements['segment2']
      );
    }

    // Check if matches segment AND genre preference
    if (
      segment &&
      topSegment.key === `SEGMENT_${segment}` &&
      preferences.genres &&
      preferences.genres.genresCodes.length &&
      book['X' + preferences.genres.genresCodes[0].toString()] === 1
    ) {
      matchedHeadings.push(
        statements['segmentGenre1'],
        statements['segmentGenre2']
      );
    }

    // Check if matches segment AND is a staff pick
    if (
      segment &&
      topSegment.key === `SEGMENT_${segment}` &&
      book['PRINT_TITLES'] === 1
    ) {
      matchedHeadings.push(
        statements['segmentPick1'],
        statements['segmentPick2']
      );
    }

    // Check if matches genres
    if (
      genres[0] &&
      book['X' + genres[0].id.toString()] === 1
    ) {
      matchedHeadings.push(statements['genre1A']);
    }

    if (
      genres[1] &&
      book['X' + genres[1].id.toString()] === 1
    ) {
      matchedHeadings.push(statements['genre1B']);
    }

    if (
      genres[2] &&
      book['X' + genres[2].id.toString()] === 1
    ) {
      matchedHeadings.push(statements['genre1C']);
    }

    if (
      genres.length > 1 &&
      book['X' + genres[0].id.toString()] === 1 &&
      book['X' + genres[1].id.toString()] === 1
    ) {
      matchedHeadings.push(statements['genre2']);
    }

    if (
      genres.length > 2 &&
      book['X' + genres[0].id.toString()] === 1 &&
      book['X' + genres[1].id.toString()] === 1 &&
      book['X' + genres[2].id.toString()] === 1
    ) {
      matchedHeadings.push(statements['genre3']);
    }

    // Check if matches genre and book clubs
    if (
      genres[0] &&
      book['X' + genres[0].id.toString()] === 1 &&
      book.Book_Club === 1 &&
      preferences.club.value
    ) {
      matchedHeadings.push(statements['genreBookClub']);
    }
    if (
      genres[1] &&
      book['X' + genres[1].id.toString()] === 1 &&
      book.Book_Club === 1 &&
      preferences.club.value
    ) {
      matchedHeadings.push(statements['genreBookClub2']);
    }
    if (
      genres[2] &&
      book['X' + genres[2].id.toString()] === 1 &&
      book.Book_Club === 1 &&
      preferences.club.value
    ) {
      matchedHeadings.push(statements['genreBookClub3']);
    }

    // check if matches audiobooks
    if (book.Audiobooks === 1 && preferences.audio.value) {
      matchedHeadings.push(
        statements['audiobooks1'],
        statements['audiobooks2']
      );
    }

    // check if matches book clubs
    if (book.Book_Club === 1 && preferences.club.value) {
      matchedHeadings.push(
        statements['bookClub1'],
        statements['bookClub2'],
        statements['bookClub3'],
      );
    }

    // check if matches book clubs AND audiobooks
    if (book.Book_Club === 1 && preferences.club.value &&
      book.Audiobooks === 1 && preferences.audio.value) {
      matchedHeadings.push(
        statements['bookClubAudio'],
      );
    }

    // check if in gift guide
    if (book['PRINT_TITLES'] === 1) {
      matchedHeadings.push(
        statements['giftGuide'],
        statements['giftGuide2'],
        statements['giftGuide3'],
      );
    }
  }

  return matchedHeadings;
}

export function getTopSegment(isbn) {
  const segments = [];
  // tslint:disable-next-line:forin
  for (const key in isbn) {
    const activeSegment = {};

    if (key.split('_')[0] === 'SEGMENT' && key !== 'SEGMENT_TOTAL') {
      activeSegment['key'] = key;
      activeSegment['score'] = isbn[key];
      segments.push(activeSegment);
    }
  }
  segments.sort(function(obj1, obj2) {
    // descending
    return obj2['score'] - obj1['score'];
  });
  // returning the highest segment.
  return segments[0];
}

export function getBookCategories(isbn) {
  const categories = [];
  // tslint:disable-next-line:forin
  for (const key in isbn) {
    if (key.indexOf('X') > -1 && isbn[key] === 1) {
      // get the name of the category
      const category = parseInt(key.split('X')[1], 10);
      const categoryName = convertTermIDToName(category);
      const catType = typeof categoryName;

      if (catType === 'string') {
        categories.push(categoryName.toLowerCase());
      }
    }
  }

  // randomly pick a category
  const currentCategory = categories[Math.floor(Math.random() * (categories.length))];

  // returning the category.
  return currentCategory;
}

export function getBookKidCategories(isbn) {
  const categories = [];
  // tslint:disable-next-line:forin
  for (const key in isbn) {
    if (
      key === 'ADVENTURE' ||
      key === 'ANIMALS' ||
      key === 'ART' ||
      key === 'CARTOONS' ||
      key === 'DINOSAURS' ||
      key === 'FAIRIES' ||
      key === 'FAMILY' ||
      key === 'FRIENDSHIP' ||
      key === 'GAMES' ||
      key === 'MAGIC' ||
      key === 'PRINCESSES' ||
      key === 'SCIENCE' ||
      key === 'SPACE' ||
      key === 'SPORTS') {
      if (isbn[key] === 1) {
        categories.push(key.toLowerCase());
      }
    }
  }
  // randomly pick a category
  const currentCategory = categories[Math.floor(Math.random() * (categories.length))];

  // returning the category.
  return currentCategory;
}

export function setStaffPick(title, resultList) {
  resultList.map(result => {
    if (result.ISBN === title.isbn) {
      if (result['STAFF_PICK'] === 1) {
        title.staffPick = true;
      } else {
      title.staffPick = false;
      }
    }
  });
}
