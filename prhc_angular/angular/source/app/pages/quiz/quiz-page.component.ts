import {
  Component,
  OnInit,
} from '@angular/core';
import { scrollToClass } from '../../services/scroll.service';

export const quizSelector = 'quiz-page';

@Component({
  selector: quizSelector,
  templateUrl: './quiz-page.component.html',
})
export class QuizComponent implements OnInit {
  result = {
    allByAuthor: {
      value: 1,
      segment: true,
      custom: false,
    },
    age: undefined,
    audio: undefined,
    club: undefined,
    fiction: {
      value: 1,
      segment: true,
      custom: false,
    },
    genres: undefined,
    quantity:  {
      value: 2,
      segment: true,
    },
    relationship:  {
      pronoun: 'You',
      value: 'Myself',
      segment: false,
      custom: true,
    },
    who: undefined,
    learning:  {
      value: 'Both',
      custom: true,
    },
    characters:  {
      value: 'I Don\'t Know',
      custom: true,
    }
  };
  showResultFlag = false;
  loading = false;
  quizPosition = 0;
  quizPositionStatement = `Question ${this.quizPosition + 1}`;
  stepForwardLabel = 'Continue';
  // this variable for newsletter signup
  formIsValid = false;
  errorMessage: string;

  ngOnInit() {
    if (window.location.hash === '#result') {
      this.showResult();
    }
  }

  enterForward(event) {
    if (event.keyCode === 13 || event.keyCode === 39) {
      this.quizStep('forward');
    } else if (event.keyCode === 37) {
      this.quizStep('back');
    }
  }

  quizStep(direction) {
    // scroll to the top of the page
    if (
      this.quizPosition < 8 ||
      (this.quizPosition < 5 && this.result.who.value === 'Child')
    ) {
      scrollToClass('quiz-page');
    }

    // change position count on click
    if (direction === 'forward') {
      this.quizPosition++;
    } else if (direction === 'back') {
      this.quizPosition--;
    }

    // change who if Child with age range with 13-17
    if (
      this.quizPosition === 1 &&
      this.result.who &&
      this.result.who.value === 'Child' &&
      this.result.age &&
      this.result.age.value === '13-17'
    ) {
      this.result.who.value = 'Teenager';
    }

    // change button copy for last step
    if (
      this.quizPosition === 7 ||
      (this.quizPosition === 4 && this.result.who.value === 'Child')
    ) {
      this.stepForwardLabel = 'Skip and Get Results';
    } else {
      this.stepForwardLabel = 'Continue';
    }

    // change copy for quiz position
    if (
      this.quizPosition >= 4 &&
      this.result.who.value === 'Child'
    ) {
      this.quizPositionStatement = undefined;
    } else if (
      this.quizPosition >= 1 &&
      this.quizPosition <= 4 &&
      this.result.who.value === 'Child'
    ) {
      this.quizPositionStatement = `Question ${this.quizPosition + 1} of 5`;
    } else {
      this.quizPositionStatement = `Question ${this.quizPosition + 1} of 8`;
    }

    // show results at the end
    if (
      this.quizPosition === 5 &&
      this.result.who.value === 'Child'
    ) {
      this.showResult();
    } else if (this.quizPosition === 8) {
      this.showResult();
    }

    // reset form validation for next step
    if (
      this.result.who.value !== 'Child' &&
      this.quizPosition !== 1 &&
      this.quizPosition !== 5 &&
      this.quizPosition !== 6 &&
      this.quizPosition !== 7
    ) {
      this.formIsValid = false;
    } else if (
      this.result.who.value === 'Child' &&
      this.quizPosition !== 2 &&
      this.quizPosition !== 3 &&
      this.quizPosition !== 4
    ) {
      this.formIsValid = false;
    }

    this.answer();
  }

  answer(event?) {
    this.errorMessage = '';

    if (event) {
      Object.assign(this.result, event);
    }

    // answers validation
    switch (this.quizPosition) {
      case 0:
        // who
        if (this.result.who  && this.result.who.value !== 'Child') {
          this.formIsValid = true;
        } else {
          this.formIsValid = false;
        }
        // age
        if (this.result.who && this.result.who.value === 'Child' && this.result.age) {
          this.formIsValid = true;
        }
        break;
      case 1:
        // fiction/ nonfiction
        if (
          this.result.who  &&
          this.result.who.value !== 'Child' &&
          this.result.fiction
        ) {
          this.formIsValid = true;
        // kids categories
        } else if (
          this.result.who  &&
          this.result.who.value === 'Child' &&
          this.result['kidCategories'] &&
          this.result['kidCategories'].length > 0
        ) {
          this.formIsValid = true;
        } else {
          this.formIsValid = false;
        }
        break;
      case 2:
        // genres
        if (
          this.result.who  &&
          this.result.who.value !== 'Child' &&
          this.result.genres &&
          this.result.genres.genresCodes.length > 0 &&
          this.result.genres.genresCodes.length <= 5
        ) {
          this.formIsValid = true;
        } else if (
          this.result.who  &&
          this.result.who.value === 'Child' &&
          this.result['learning']
        ) {
          this.formIsValid = true;
        } else {
          this.formIsValid = false;
        }
        break;
      case 3:
        // audiobook
        if (
          this.result.who  &&
          this.result.who.value !== 'Child' &&
          this.result.audio
        ) {
          this.formIsValid = true;
        }
        break;
      case 4:
        // book club
        if (
          this.result.who  &&
          this.result.who.value !== 'Child' &&
          this.result.club
        ) {
          this.formIsValid = true;
        }
        break;
    }
  }

  isFormValid(flag) {
    if (
      this.quizPosition === 7 ||
      (this.quizPosition === 4 && this.result.who.value === 'Child')
    ) {
      // change label
      if (flag) {
        this.stepForwardLabel = 'Sign Up and Get Results';
      } else {
        this.stepForwardLabel = 'Skip and Get Results';
      }

      // TODO: send mws requrest
    }
  }

  showResult() {
    if (window.location.hash !== '#result') {
      window.history.pushState('', '', '/book-finder#result');
    }

    this.showResultFlag = true;
    this.loading = true;
  }

  resultIsLoaded(status) {
    this.loading = !status;
  }
}
