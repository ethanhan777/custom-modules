import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

export const quizAudiobooksSelector = 'quiz-audiobooks';

@Component({
  selector: quizAudiobooksSelector,
  templateUrl: './quiz-audiobooks.component.html',
})
export class QuizAudiobooksComponent implements OnInit {
  @Output() selectedItem = new EventEmitter<any>();
  @Input() person;
  @Input() prevAnswer;
  genreList = [];
  segmentList = [];
  title = 'Do they listen to audiobooks?';
  // subtitle = 'Are they a podcast fan? Do they prefer audiobooks over print?';
  subtitle = '';
  type = 'radio';
  options =  [
    {
      name: 'Yes',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/audiobooks@4x.png',
    },
    {
      name: 'No',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/audiobook-opposite@4x.png',
    },
  ];

  ngOnInit() {
    // check if this was answered before and display that
    if (this.prevAnswer) {
      if (this.prevAnswer.value === true) {
        Object.assign(this.options[0], {active: true});
      } else if (this.prevAnswer.value === false) {
        Object.assign(this.options[1], {active: true});
      }
    }

    if (this.person.value === 'in-laws') {
      this.title = `Do they listen to audiobooks?`;
    } else if (this.person.pronoun === `your ${this.person.value}`) {
      this.title = `Does  ${this.person.pronoun} listen to audiobooks?`;
      // this.subtitle = `Is ${this.person.pronoun} a podcast fan? Do they prefer audiobooks over print?`;
    } else if (this.person.pronoun === 'you') {
      this.title = `Do you listen to audiobooks?`;
      // this.subtitle = `Are you a podcast fan? Do you prefer audiobooks over print?`;
    }
  }

  humanType(answer) {
    if (answer === 'Yes') {
      answer = true;
    } else {
      answer = false;
    }
    this.selectedItem.emit({
      audio: {
        value: answer,
        custom: true,
      }
    });
  }
}
