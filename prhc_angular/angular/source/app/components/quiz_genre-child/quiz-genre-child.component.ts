import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

export const quizGenreChildSelector = 'quiz-genre-child';

@Component({
  selector: quizGenreChildSelector,
  templateUrl: './quiz-genre-child.component.html',
})
export class QuizGenreChildComponent implements OnInit {
  @Output() selectedGenres = new EventEmitter<any>();
  @Input() person;
  @Input() prevAnswer;
  genreList = [];
  title = 'Choose the top 3 things that they absolutely love';
  type = 'checkbox';
  options =  {
    fiction: [
      {
        name: 'Adventure',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/Adventure@4x.png',
        active: undefined,
      },
      {
        name: 'Animals',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/Animals@4x.png',
        active: undefined,
      },
      {
        name: 'Art',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/art@4x.png',
        active: undefined,
      },
      {
        name: 'Cartoons',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/cartoons@4x.png',
        active: undefined,
      },
      {
        name: 'Dinosaurs',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/dinosaurs@4x.png',
        active: undefined,
      },
      {
        name: 'Fairies',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/fairies@4x.png',
        active: undefined,
      },
      {
        name: 'Family',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/Family@4x.png',
        active: undefined,
      },
      {
        name: 'Friendship',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/friendship@4x.png',
        active: undefined,
      },
      {
        name: 'Games',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/games@4x.png',
        active: undefined,
      },
      {
        name: 'Magic',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/fantasy@4x.png',
        active: undefined,
      },
      {
        name: 'Princesses',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/princesses@4x.png',
        active: undefined,
      },
      {
        name: 'Science',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/science-tech@4x.png',
        active: undefined,
      },
      {
        name: 'Space',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/science-fiction@4x.png',
        active: undefined,
      },
      {
        name: 'Sports',
        icon: '../../../../../../../../themes/custom/penguin/images/icons/sports@4x.png',
        active: undefined,
      },
    ],
  };

  genres = [];

  ngOnInit() {
    // check if this was answered before and display that
    if (this.prevAnswer) {
      this.genres = this.prevAnswer;
      this.options.fiction.map(option => {
        if (this.prevAnswer.indexOf(option.name) > -1) {
          option['active'] = true;
        } else {
          option['active'] = undefined;
        }
      });
    }
    if (this.person.pronoun === `your ${this.person.value}`) {
      this.title = `Choose the top 3 things that ${this.person.pronoun} absolutely loves`;
    } else if (this.person.pronoun === 'You') {
      this.title = `Choose the top 3 things that you absolutely love`;
    }
  }

  humanType(option) {

    if (this.genres.indexOf(option) > -1) {
      const position = this.genres.indexOf(option);
      this.genres.splice(position, position + 1);
    } else {
      this.genres.push(option);
    }

    this.selectedGenres.emit({ kidCategories: this.genres });
  }
}
