import { Component, Output, EventEmitter } from '@angular/core';

export const quizWhoSelector = 'quiz-who';

@Component({
  selector: quizWhoSelector,
  templateUrl: './quiz-who.component.html',
})
export class QuizWhoComponent {
  title = 'Who are you shopping for?';
  subtitle = 'Select one';
  type = 'radio';
  options = [
    'Adult',
    'Teenager',
    'Child'
  ];

  @Output() selectedPerson = new EventEmitter<any>();

  humanType(person) {
    this.selectedPerson.emit({
        who:  {
          value: person,
          segment: false,
          custom: true,
        }
      });
  }
}
