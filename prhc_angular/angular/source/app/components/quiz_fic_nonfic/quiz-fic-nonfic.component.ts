import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

export const quizFicSelector = 'quiz-fic';

@Component({
  selector: quizFicSelector,
  templateUrl: './quiz-fic-nonfic.component.html',
})
export class QuizFicComponent implements OnInit {
  @Output() selectedFiction = new EventEmitter<any>();
  @Input() person;
  @Input() prevAnswer;
  title = 'Do they like more fiction or non-fiction?';
  subtitle = 'Tip: Fiction is imaginary, non-fiction is factual';
  type = 'range';
  min = 1;
  max = 6;
  selectedValue = 1;
  selectedClass: string;

  ngOnInit() {
    // check if this has been answered already
    if (this.prevAnswer) {
      this.selectedValue = this.prevAnswer.value;
    }

    if (this.person.value === 'in-laws') {
      this.title = `Do they like fiction or non-fiction?`;
    } else if (this.person.pronoun === `your ${this.person.value}`) {
      this.title = `Does ${this.person.pronoun} like more fiction or non-fiction?`;
    } else if (this.person.pronoun === 'you') {
      this.title = `Do you like fiction or non-fiction?`;
    }
  }

  selectedRange() {
    this.selectedClass = `mlcl_quiz-range-${this.selectedValue}0`;
    this.selectedFiction.emit({
      fiction: {
        value: this.selectedValue,
        segment: true,
        custom: false,
      }
    });
  }
}
