import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

export const quizLearnFunSelector = 'quiz-learn-fun';

@Component({
  selector: quizLearnFunSelector,
  templateUrl: './quiz-learn-fun.component.html',
})
export class QuizLearnFunComponent implements OnInit {
  @Output() selectedItem = new EventEmitter<any>();
  @Input () person;
  @Input() prevAnswer;
  title = 'Do you want them to learn something new, or just have fun?';
  type = 'radio';
  options =  [
    {
      name: 'Learn Something New',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/ya@4x.png',
    },
    {
      name: 'Both',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/fun-learn@4x.png',
      active: true,
    },
    {
      name: 'Have Fun',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/children@4x.png',
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
      this.options[1]['active'] = true;
    }

    if (this.person.pronoun === `your ${this.person.value}`) {
      this.title = `Do you want ${this.person.pronoun} to learn something new, or just have fun?`;
    } else if (this.person.pronoun === 'You') {
      this.title = `Do you want to learn something new, or just have fun?`;
    }
  }

  humanType(answer) {
    this.selectedItem.emit({
      learning:  {
        value: answer,
        custom: true,
      }
    });
  }
}
