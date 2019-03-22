import {
  Component,
  Input,
  Output,
  EventEmitter
 } from '@angular/core';

import { convertToHumanType } from '../../services/common.service';

export const quizRelationshipSelector = 'quiz-relationship';

@Component({
  selector: quizRelationshipSelector,
  templateUrl: './quiz-relationship.component.html',
})
export class QuizRelationshipComponent {
  @Input() person: string;
  @Output() selectedRelationship = new EventEmitter<any>();
  title = 'Who are they to you?';
  type = 'radio';
  options =  {
    adult: [
      'Myself',
      'Dad',
      'Mom',
      'Brother',
      'Sister',
      'Pet',
      'Significant Other',
      'In-Laws',
      'Aunt',
      'Uncle',
      'Grandparent',
      'Boss',
      'Colleague',
      'Teacher',
      'Friend',
      'Crush',
      'It\'s Complicated',
      'Neighbour',
      'Stranger',
      'Barista',
      'Nemesis',
    ],
    child: [
      'Myself',
      'Brother',
      'Sister',
      'Child',
      'Pet',
      'Grandchild',
      'Friend',
      'Crush',
      'Neighbour',
      'Stranger'
    ],
  };

  humanType(person) {
    person = person.toLowerCase();
    // set relationship in session storage
    sessionStorage.setItem('prhc-quiz-profile', person);

    // this determines the structure of the question copy
    this.selectedRelationship.emit({
      relationship:  {
        pronoun: convertToHumanType(person),
        value: person,
        segment: false,
        custom: true,
      }
    });
  }
}
