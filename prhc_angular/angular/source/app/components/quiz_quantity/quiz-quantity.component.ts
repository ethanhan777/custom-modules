import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

export const quizQuantitySelector = 'quiz-quantity';

@Component({
  selector: quizQuantitySelector,
  templateUrl: './quiz-quantity.component.html',
})
export class QuizQuantityComponent implements OnInit {
  @Output() selectedItem = new EventEmitter<any>();
  @Input() person;
  @Input() prevAnswer;
  genreList = [];
  segmentList = [];
  title = 'How many books would you guess they read in a year?';
  type = 'radio';
  options =  [
    {
      name: '0-5',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/favicon-114x114.png',
      active: true,
    },
    {
      name: '5-10',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/favicon-114x114.png',
    },
    {
      name: '10-15',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/favicon-114x114.png',
    },
    {
      name: '15-20',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/favicon-114x114.png',
    },
    {
      name: '20-25',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/favicon-114x114.png',
    },
    {
      name: '25+',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/favicon-114x114.png',
    },
  ];

  ngOnInit() {
    // check if this was answered before and display that
    if (this.prevAnswer) {
      this.options.map(option => {
        if (option.name === '0-5' && this.prevAnswer.value <= 5) {
          option['active'] = true;
        } else if (option.name === '5-10' && this.prevAnswer.value >= 5 && this.prevAnswer.value <= 10) {
          option['active'] = true;
        } else if (option.name === '10-15' && this.prevAnswer.value >= 10 && this.prevAnswer.value <= 15) {
          option['active'] = true;
        } else if (option.name === '15-20' && this.prevAnswer.value >= 15 && this.prevAnswer.value <= 20) {
          option['active'] = true;
        } else if (option.name === '20-25' && this.prevAnswer.value >= 20 && this.prevAnswer.value <= 25) {
          option['active'] = true;
        } else if (option.name === '25+' && this.prevAnswer.value >= 25) {
          option['active'] = true;
        } else {
          option['active'] = undefined;
        }
      });
    } else {
      this.options[0]['active'] = true;
    }

    if (this.person.value === 'in-laws') {
      this.title = `How many books do they read in a year?`;
    } else if (this.person.pronoun === `your ${this.person.value}`) {
      this.title = `How many books would you guess ${this.person.pronoun} reads in a year?`;
    } else if (this.person.pronoun === 'you') {
      this.title = `How many books do you read in a year?`;
    }
  }

  humanType(answer) {
    let value = 0;
    switch (answer) {
      case  '0-5':
        value = 2;
        break;
      case  '5-10':
        value = 7;
        break;
      case  '10-15':
        value = 12;
        break;
      case  '15-20':
        value = 17;
        break;
      case  '20-25':
        value = 22;
        break;
      case  '25+':
        value = 25;
        break;
    }
    this.selectedItem.emit({
      quantity:  {
        value: value,
        segment: true,
      }
    });
  }
}
