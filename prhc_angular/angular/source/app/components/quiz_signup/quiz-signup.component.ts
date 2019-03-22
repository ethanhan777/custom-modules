import {
  Component,
  Output,
  EventEmitter
} from '@angular/core';

export const quizSignupSelector = 'quiz-signup';

@Component({
  selector: quizSignupSelector,
  templateUrl: './quiz-signup.component.html',
})
export class QuizSignupComponent {
  title = 'We\'ve got more suggestions for you!';
  subtitle = 'Sign up for our newsletter and receive personalized picks, plus exclusive author content and giveaways.';
  buttonLabel = '';
  @Output() validFormFlag = new EventEmitter<any>();
  @Output() stepAction = new EventEmitter<any>();

  isFormValid(flag) {
    this.validFormFlag.emit(flag);
  }

  step(action) {
    this.stepAction.emit(action);
  }
}
