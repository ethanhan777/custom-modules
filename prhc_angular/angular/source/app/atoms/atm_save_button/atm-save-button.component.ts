import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  Injectable,
} from '@angular/core';

import {
  TealiumUtagService,
  parseUtagLinkTitle,
  parseUtagLinkForQuiz
} from '../../services/utag.service';

@Component({
  selector: 'atm-save-button',
  templateUrl: './atm-save-button.component.html',
})
@Injectable()
export class AtmSaveButtonComponent implements OnInit {
  // profile tag string
  @Input() profile;
  // data to save in session storage
  @Input() data;
  @Input() index;
  @Input() isSimple = false;
  @Output() savedBook = new EventEmitter<any>();
  // status of data being saved
  status = false;
  icon = 'heart-o';
  label = 'Save';

  constructor (private tealium: TealiumUtagService) {}

  ngOnInit() {
    // get profile from sessionStorage if empty
    if (!this.profile) {
      const profile = sessionStorage.getItem('prhc-quiz-profile');
      this.profile = profile ? profile : 'Myself';
    }

    // adding profile tag to isbn
    this.data.profileTag = [this.profile];
    const savedData = localStorage.getItem('prhc-saved-books');
    if (savedData) {
      const items = JSON.parse(savedData);
      const parsedData = items[this.data.isbn];
      if (
        parsedData &&
        parsedData.profileTag &&
        parsedData.profileTag.indexOf(this.profile) > -1
      ) {
        this.status = true;
        this.setSavedStatus();
      }
    }
  }

  saveData() {
    const savedData = localStorage.getItem('prhc-saved-books');
    // check if there's saved data
    if (savedData) {
      // const parsedData = JSON.parse(savedData);
      const items = JSON.parse(savedData);
      const parsedData = items[this.data.isbn];
      if (parsedData) {
        // if new profile in existing isbn doesn't exist, add the new profile
        if (parsedData.profileTag.indexOf(this.profile) < 0) {
          parsedData.profileTag.push(this.profile);
          items[parsedData.isbn] = parsedData;
          localStorage.setItem('prhc-saved-books', JSON.stringify(items));
          this.status = true;
        // if new profile in existing isbn does exist, remove the profile
        } else if (
          parsedData.profileTag.indexOf(this.profile) > -1 &&
          parsedData.profileTag.length > 1
        ) {
          parsedData.profileTag.splice(parsedData.profileTag.indexOf(this.profile), 1);
          items[parsedData.isbn] = parsedData;
          localStorage.setItem('prhc-saved-books', JSON.stringify(items));
          this.status = false;
        // if new profile in existing isbn does exist but that's the only profile,
        // remove the session data.
        } else if (
          parsedData.profileTag.indexOf(this.profile) > -1 &&
          parsedData.profileTag.length === 1
        ) {
          delete items[parsedData.isbn];
          localStorage.setItem('prhc-saved-books', JSON.stringify(items));
          this.status = false;
        }

      // if isbn doesn exist, add new.
      } else {
        items[this.data.isbn] = this.data;
        localStorage.setItem('prhc-saved-books', JSON.stringify(items));
        this.status = true;
      }

    } else {
      const item = {};
      item[this.data.isbn] = this.data;
      localStorage.setItem('prhc-saved-books', JSON.stringify(item));
      this.status = true;
    }

    this.sendTealiumData(this.status);

    this.setSavedStatus();
  }

  setSavedStatus() {
    if (this.status) {
      this.icon = 'heart';
      this.label = 'Saved';
    } else {
      this.icon = 'heart-o';
      this.label = 'Save';
    }

    this.savedBook.emit({status: this.status, isbn: this.data.isbn});
  }

  sendTealiumData(status) {
    let utagData = parseUtagLinkTitle(this.data);

    if (typeof this.index === 'undefined') {
      const quizResult = sessionStorage.getItem('prhc-quiz-result');

      if (quizResult) {
        const data = JSON.parse(quizResult);
        utagData = Object.assign(parseUtagLinkForQuiz(data['allInputs'], data['segment']), utagData);
      }
    }

    if (status) {
      utagData['event_type'] = 'save_book';
    } else {
      utagData['event_type'] = 'remove_book';
    }
    utagData['title_index'] = this.index;

    this.tealium.track('link', utagData);
  }
}
