import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

import { categoriesMapping } from '../../services/segment_api.service';

export const quizGenreSelector = 'quiz-genre';

@Component({
  selector: quizGenreSelector,
  templateUrl: './quiz-genre.component.html',
})
export class QuizGenreComponent implements OnInit {
  @Output() selectedGenres = new EventEmitter<any>();
  @Input() person;
  @Input() ageBracket;
  @Input() prevAnswer;
  genreList = [];
  segmentList = [];
  title = 'Select up to 5 types of books they typically like to read';
  type = 'checkbox';
  options =  categoriesMapping;

  genres = {
    segment: true,
    segmentVal: {
      rid: Math.floor((Math.random() * 100) + 1),
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
    },
    custom: true,
    genresCodes: [],
  };

  updatedOptions = {
    fiction: [],
    nonFiction: [],
  };

  ngOnInit() {
    // check if this was answered before and display that
    if (this.prevAnswer && this.prevAnswer.genresCodes) {
      this.genres.genresCodes = this.prevAnswer.genresCodes;
      this.options.nonFiction.map(option => {
        if (this.prevAnswer.genresCodes.indexOf(option.catId) > -1) {
          option['active'] = true;
        } else {
          option['active'] = undefined;
        }
      });
      this.options.fiction.map(option => {
        if (this.prevAnswer.genresCodes.indexOf(option.catId) > -1) {
          option['active'] = true;
        } else {
          option['active'] = undefined;
        }
      });
    }
    // Only show the categories based on if they're looking for adult or teen
    // check fiction
    this.options.fiction.map(ficGenre => {
      if (ficGenre.adult && this.ageBracket === 'Adult') {
        this.updatedOptions.fiction.push(ficGenre);
      } else if (ficGenre.teenager && this.ageBracket !== 'Adult') {
        this.updatedOptions.fiction.push(ficGenre);
      }
    });

    // check non-fiction
    this.options.nonFiction.map(nonficGenre => {
      if (nonficGenre.adult && this.ageBracket === 'Adult') {
        this.updatedOptions.nonFiction.push(nonficGenre);
      } else if (nonficGenre.teenager && this.ageBracket !== 'Adult') {
        this.updatedOptions.nonFiction.push(nonficGenre);
      }
    });

    if (this.person.value === 'in-laws') {
      this.title = `Select up to 5 types of books they typically like to read`;
    } else if (this.person.pronoun === `your ${this.person.value}`) {
      this.title = `Select up to 5 types of books ${this.person.pronoun} typically likes to read`;
    } else if (this.person.pronoun === 'you') {
      this.title = `Select up to 5 types of books you typically like to read`;
    }
  }

  humanType(genreCode, segCode) {
    // Toggle the selected genres
    for (const segId in this.genres.segmentVal) {
      if (segId === segCode && this.genres.segmentVal[segCode] === 0) {
        this.genres.segmentVal[segCode] = 1;
      } else if (segId === segCode && this.genres.segmentVal[segCode] === 1) {
        this.genres.segmentVal[segCode] = 0;
      }
    }

    // add an array of category IDs for enhanced API
    const index = this.genres.genresCodes.indexOf(genreCode);
    if (index < 0) {
      this.genres.genresCodes.push(genreCode);
    } else {
      this.genres.genresCodes.splice(index, 1);
    }

    this.selectedGenres.emit({ genres: this.genres });
  }
}
