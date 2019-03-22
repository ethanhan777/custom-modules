import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

export const quizBookClubSelector = 'quiz-book-club';

@Component({
  selector: quizBookClubSelector,
  templateUrl: './quiz-book-club.component.html',
})
export class QuizBookClubComponent implements OnInit {
  @Output() selectedItem = new EventEmitter<any>();
  @Input () person;
  @Input() prevAnswer;
  genreList = [];
  segmentList = [];
  title = 'Are they in a book club?';
  type = 'radio';
  options =  [
    {
      name: 'Yes',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/book-club@4x.png',
    },
    {
      name: 'No',
      icon: '../../../../../../../../themes/custom/penguin/images/icons/book-club-opposite@4x.png',
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
      this.title = `Are they in a book club?`;
    } else if (this.person.pronoun === `your ${this.person.value}`) {
      this.title = `Is ${this.person.pronoun} in a book club?`;
    } else if (this.person.pronoun === 'you') {
      this.title = `Are you in a book club?`;
    }
  }

  humanType(answer) {
    if (answer === 'Yes') {
      answer = true;
    } else {
      answer = false;
    }
    this.selectedItem.emit({
      club:  {
        value: answer,
        custom: true,
      }
    });
  }
}
