import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';

export const quizAuthorSelector = 'quiz-author';

@Component({
  selector: quizAuthorSelector,
  templateUrl: './quiz-author.component.html',
})
export class QuizAuthorComponent implements OnInit {
  @Output() selectedItem = new EventEmitter<any>();
  @Input() person;
  @Input() prevAnswer;
  title = 'Do they like to read every book by their favourite authors?';
  type = 'range';
  min = 1;
  max = 9;
  selectedValue = 1;
  selectedClass: string;

  ngOnInit() {
    // check if this has been answered already
    if (this.prevAnswer) {
      this.selectedValue = this.prevAnswer.value;
    }

    if (this.person.value === 'in-laws') {
      this.title = `Do they like to read every book by their favourite authors?`;
    } else if (this.person.pronoun === `your ${this.person.value}`) {
      this.title = `Does ${this.person.pronoun} like to read every book by their favourite authors?`;
    } else if (this.person.pronoun === 'you') {
      this.title = `Do you like to read every book by your favourite authors?`;
    }
  }

  selectedRange() {
    this.selectedClass = `mlcl_quiz-range-${this.selectedValue}0`;
    this.selectedItem.emit({
      allByAuthor: {
        value: this.selectedValue,
        segment: true,
        custom: false,
      }
    });
  }
}
