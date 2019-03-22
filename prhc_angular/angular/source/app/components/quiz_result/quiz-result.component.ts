import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';

import {
  SegmentApiService,
  filterRecommendation,
  rankRecommendation,
  rankChildRecommendation,
  setFeaturedCustomHeading,
  setStaffPick,
  convertTermIDToName
} from '../../services/segment_api.service';
import {
  EnhancedApiService,
  parseFeaturedBooks
} from '../../services/enhanced_api.service';

import {
  TealiumUtagService,
  parseUtagLinkForQuiz
} from '../../services/utag.service';

import {
  truncateString,
  removeBoldTags,
} from '../../services/common.service';

export const quizResultSelector = 'quiz-result';

@Component({
  selector: quizResultSelector,
  templateUrl: './quiz-result.component.html',
})
export class QuizResultComponent implements OnInit, OnDestroy {
  // dummy input data for testing.
  @Input() allInputs;
  @Output() resultIsLoaded = new EventEmitter<any>();

  segInputs = {
    dig_var1: 0,
    dig_var2: 0,
    dig_var3: 0,
    dig_var4: 0,
    dig_var5: 0,
    dig_var6: 0,
    dig_var7: 0,
    dig_var8: 0,
    dig_var9: 0,
    dig_var10: 0,
    dig_var11: 0,
    dig_var12: 0,
    dig_var13: 0,
    dig_var14: 0,
    dig_var15: 0,
    dig_var16: 0,
    dig_var17: 0,
    dig_var18: 0,
    dig_var19: 0,
    dig_var20: 0,
    dig_var21: 0,
    dig_var22: 0,
    dig_var23: 0,
    dig_var24: 0,
    dig_var25: 0,
    dig_var26: 0,
    dig_var27: 0,
    dig_var28: 0,
    dig_var29: 0,
    dig_var30: 0,
    dig_var31: 0,
    dig_var32: 0,
    dig_var33: 0,
    dig_var34: 0,
  };
  private subscriptions = new Subscriber();
  private allResults = [];
  private categories = [];
  private numberOfResults = 12;
  segment;
  profile = 'Myself';
  results = [];
  loading = false;
  loadMoreFlag = false;
  errorFlag = false;
  savedBookDisplayFlag = {};
  isbn = '';
  recomendationMappingTerms = [];
  shareUrl = 'https://penguinrandomhouse.ca/book-finder';

  shareData = {
    label: 'Like what you see? Share with your friends!',
    headerLabel: 'Sign up for our newsletter and discover your next great read.',
    relatedLinks: [
      {
        linkAttr: 17000,
        url: 'https://www.facebook.com/sharer/sharer.php?u=' + this.shareUrl,
        label: 'Share on Facebook',
        windowWidth: 600,
        windowHeight: 860,
        share: true,
      },
      {
        pinterest: true,
        url: 'https://www.pinterest.com/pin/create/button/',
        label: 'Save to Pinterest',
        windowWidth: 600,
        windowHeight: 860,
        share: true,
      },
      {
        linkAttr: 19000,
        url: 'https://twitter.com/intent/tweet?url=' + this.shareUrl,
        label: 'Share on Twitter',
        windowWidth: 600,
        windowHeight: 860,
        share: true,
      },
    ]
  };

  constructor (
    private segmentApi: SegmentApiService,
    private enhacnedApi: EnhancedApiService,
    private tealium: TealiumUtagService
  ) {}

  ngOnInit() {
    // change Child to Teenager if age range is 13-17
    if (this.allInputs.age && this.allInputs.age.value === '13-17') {
      this.allInputs.who.value = 'Teenager';
    }
    // set categories
    if (
      this.allInputs.genres &&
      this.allInputs.genres.genresCodes &&
      this.allInputs.genres.genresCodes.length
    ) {
      this.categories = this.allInputs.genres.genresCodes;
    }
    // set profile
    if (this.allInputs.relationship) {
      this.profile = this.allInputs.relationship.value;
    }

    // set recomendation mapping terms
    this.recomendationMappingTerms = setRecommendationMappingTerms(this.allInputs);

    // get previously saved data from session storage
    const savedData = sessionStorage.getItem('prhc-quiz-result');

    if (savedData) {
      const parsedSavedData = JSON.parse(savedData);
      // return cached result if who is empty which means it's refreshed or back history page.
      // return cached result if input values are the same as previous.
      if (
        !this.allInputs.who ||
        JSON.stringify(parsedSavedData.allInputs) === JSON.stringify(this.allInputs)
      ) {
        // use cached data
        this.allResults = parsedSavedData.titles;
        this.recomendationMappingTerms = parsedSavedData.recomendationMappingTerms;
        this.allInputs = parsedSavedData.allInputs;
        this.segment = parsedSavedData.segment;
        this.setResults(this.allResults, this.numberOfResults);
      } else {
        if (this.allInputs.who && this.allInputs.who.value === 'Child') {
          this.preprocessForChild(this.allInputs);
        } else {
          this.preprocessForAdult(this.allInputs);
        }
      }
    } else {
      if (this.allInputs.who && this.allInputs.who.value === 'Child') {
        this.preprocessForChild(this.allInputs);
      } else {
        this.preprocessForAdult(this.allInputs);
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  preprocessForAdult(allInputs) {
    // set segment api inputs
    if (allInputs.genres && allInputs.genres.segmentVal) {
      this.segInputs = allInputs.genres.segmentVal;
      this.segInputs['dig_var32'] = allInputs.fiction ? allInputs.fiction.value : 1;
      this.segInputs['dig_var33'] = allInputs.allByAuthor ? allInputs.allByAuthor.value : 1;
      this.segInputs['dig_var34'] = allInputs.quantity ? allInputs.quantity.value : 0;
    }

    // call segment api
    this.subscriptions.add(
      this.segmentApi
        .getResult(this.segInputs)
        .subscribe (resp => {
          let reco = resp.reco;

          // // rating isbns by segment scores
          // const recoList = prioritiseRecommendation(resp.reco, resp.segment, this.categories);
          // // get previously saved data from session storage
          // const savedData = sessionStorage.getItem('prhc-quiz-result');
          this.segment = resp.segment['Results'][0];
          // got titles from recomendation json file
          if (resp.segment && resp.segment['Results']) {
            // filter isbns by custom questions.
            reco = filterRecommendation(
              reco,
              allInputs.who ? allInputs.who.value : 'Adult'
            );

            // rating isbns by segment scores
            const recoList = rankRecommendation(
              reco,
              resp.segment,
              allInputs.fiction ? allInputs.fiction.value : 1,
              this.categories,
              allInputs.audio ? allInputs.audio.value : false,
              allInputs.club ? allInputs.club.value : false
            );

            // set recomendation mapping terms for segment number
            this.recomendationMappingTerms.push(resp.segment['Results'][0].Name);

            // get enhanced titles
            this.getRecommendedTitles(recoList, allInputs, this.recomendationMappingTerms);

          // titles exist from session storage
          } else {
            console.log('error: segment result is missing.', resp);
            this.errorFlag = true;
          }
          // this.resultIsLoaded.emit(true);
        })
    );
  }

  preprocessForChild(allInputs) {
    this.subscriptions.add(
      this.segmentApi
        .getReco()
        .subscribe (reco => {
          // filter isbns by custom questions.
          reco = filterRecommendation(reco, 'Child');

          // rating isbns by segment scores
          const recoList = rankChildRecommendation(
            reco,
            this.allInputs.kidCategories,
            this.allInputs.age.value,
          );

          // get titles data from enhaced api
          this.getRecommendedTitles(recoList, allInputs, this.recomendationMappingTerms);
        })
    );
  }

  getRecommendedTitles(recoList, allInputs, recomendationMappingTerms) {
    const isbns = [];
    recoList.map(result => {
      isbns.push(result.ISBN);
    });

    const zoom = [
      'https://api.penguinrandomhouse.com/title/authors/definition',
      'https://api.penguinrandomhouse.com/title/categories/definition',
      'https://api.penguinrandomhouse.com/title/titles/content/definition',
    ];

    const params = {
      zoom: zoom.join(','),
      catSetId: 'CN',
    };

    // child don't have segments
    let segment;
    if (this.segment) {
      segment = this.segment.Segment;
    }

    // set custom headings

    recoList = setFeaturedCustomHeading(recoList, allInputs, segment);
    this.subscriptions.add(
      this.enhacnedApi
        .getTitle(isbns, false, params)
        .map(parseFeaturedBooks)
        .subscribe(titles => {
          titles.map(title => {
            // check if the book is in the gift guide
            setStaffPick(title, recoList);

            title.aboutTheBook = title.positioning ?
            removeBoldTags(title.positioning) :
            truncateString(title.aboutTheBook, 280);

            recoList.map(book => {
              if (title.isbn === book.ISBN) {
                title.customHeading = book.customHeading;
              }
            });
          });

          // apply the weighting from recommendation ranking
          this.allResults = [];
          isbns.map(isbn => {
            this.allResults.push(titles.filter(title => title.isbn === isbn)[0]);
          });

          // removing undefined from list
          this.allResults = this.allResults.filter(title => title !== undefined);

          const savedData = {
            titles: titles,
            allInputs: allInputs,
            recomendationMappingTerms: recomendationMappingTerms,
            segment: this.segment,
          };

          sessionStorage.setItem('prhc-quiz-result', JSON.stringify(savedData));

          this.setResults(this.allResults, this.numberOfResults);
        })
    );
  }

  setResults(allResults, numberOfResults) {
    if (allResults.length > numberOfResults) {
      this.results = allResults.splice(0, numberOfResults);
      this.loadMoreFlag = true;
    } else {
      this.results = allResults;
    }

    this.sendTealiumData('view');

    this.resultIsLoaded.emit(true);
  }

  loadMoreResults() {
    const next = this.allResults.splice(0, this.numberOfResults);
    this.results = this.results.concat(next);

    if (this.allResults.length === 0) {
      this.loadMoreFlag = false;
    }

    this.sendTealiumData('link', {
      'module_type': 'Recommendation Results Actions',
      'module_variation': 'Load More',
    });
  }

  saveOnClick(resp) {
    this.savedBookDisplayFlag = resp;
  }

  sendTealiumData(type, data?) {
    if (type === 'view') {
      const utagData = parseUtagLinkForQuiz(this.allInputs, this.segment);
      this.tealium.track(type, utagData);
    } else if (type === 'link' && data) {
      this.tealium.track(type, data);
    }
  }
}

export function setRecommendationMappingTerms(allInputs) {
  const recomendationMappingTerms = [];

  // categories
  if (allInputs.genres && allInputs.genres.genresCodes && allInputs.genres.genresCodes.length) {
    allInputs.genres.genresCodes.map(genre => {
      recomendationMappingTerms.push(convertTermIDToName(genre));
    });
  }
  // audiobooks
  if (allInputs.audio && allInputs.audio.value) {
    recomendationMappingTerms.push('Audiobooks');
  }
  // book clubs
  if (allInputs.club && allInputs.club.value) {
    recomendationMappingTerms.push('Book Clubs');
  }
  // relationship
  if (allInputs.relationship && allInputs.relationship.value) {
    recomendationMappingTerms.push(allInputs.relationship.value);
  }

  // kidCategories
  if (allInputs.kidCategories && allInputs.kidCategories.length) {
    allInputs.kidCategories.map(kidCategory => {
      // adding K tag for kid sports as it overraps with adult sports
      if (kidCategory === 'Sports') {
        kidCategory += '-K';
      }
      recomendationMappingTerms.push(kidCategory);
    });
  }
  // age
  if (allInputs.age && allInputs.age.value) {
    recomendationMappingTerms.push(allInputs.age.value);
  }
  // learning
  if (allInputs.learning && allInputs.learning.value) {
    recomendationMappingTerms.push(allInputs.learning.value);
  }
  // characters
  if (allInputs.characters && allInputs.characters.value) {
    recomendationMappingTerms.push(allInputs.characters.value);
  }

  return recomendationMappingTerms;
}
