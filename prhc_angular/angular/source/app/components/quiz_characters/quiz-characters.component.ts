import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

export const quizCharactersSelector = 'quiz-characters';

@Component({
  selector: quizCharactersSelector,
  templateUrl: './quiz-characters.component.html',
})
export class QuizCharactersComponent implements OnInit {
  @Output() selectedItem = new EventEmitter<any>();
  @Input () person;
  @Input() prevAnswer;
  genreList = [];
  segmentList = [];
  title = 'Do they like to read different books with the same characters?';
  type = 'radio';
  options =  [
    {
      name: 'Yes',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/characters-repeat@4x.png',
      active: undefined,
    },
    {
      name: 'No',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/characters-no-repeat@4x.png',
      active: undefined,
    },
    {
      name: 'I Don\'t Know',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/characters-dont-know@4x.png',
      active: undefined,
    },
  ];

  ngOnInit() {
    // check if this was answered before and display that
    if (this.prevAnswer) {
      this.options.map(option => {
        if (option.name === this.prevAnswer.value) {
          option['active'] = true;
        } else {
          option['active'] = undefined;
        }
      });
    } else {
      this.options[2]['active'] = true;
    }

    if (this.person.pronoun === `your ${this.person.value}`) {
      this.title = `Does  ${this.person.pronoun} like to read different books with the same characters?`;
    } else if (this.person.pronoun === 'you') {
      this.title = `Do you like to read different books with the same characters?`;
    }
  }

  humanType(answer) {
    this.selectedItem.emit({
      characters:  {
        value: answer,
        custom: true,
      }
    });
  }
}
