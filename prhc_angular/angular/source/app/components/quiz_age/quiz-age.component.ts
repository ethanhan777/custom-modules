import { Component, Input, Output, EventEmitter } from '@angular/core';

export const quizAgeSelector = 'quiz-age';

@Component({
  selector: quizAgeSelector,
  templateUrl: './quiz-age.component.html',
})
export class QuizAgeComponent {
  @Input() person: string;
  @Output() selectedAge = new EventEmitter<any>();
  title = 'How old are they?';
  type = 'radio';
  options = [
    '0-2',
    '3-7',
    '8-12',
    '13-17'
  ];

  humanType(range) {
    this.selectedAge.emit({
      age: {
        value: range,
        custom: true,
      }
    });
  }
}
