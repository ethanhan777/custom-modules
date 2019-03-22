import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';

@Component({
  selector: 'mlcl-contributors',
  templateUrl: './mlcl-contributors.component.html',
})
export class MlclContributorsComponent implements OnInit, OnChanges {
  @Input() contributors = [];
  formattedContributors = [];

  ngOnInit() {
    this.formattedContributors = parseContributors(this.contributors);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contributors && changes.contributors.previousValue) {
      const newContributors: SimpleChange = changes.contributors;
      this.formattedContributors = parseContributors(newContributors.currentValue);
    }
  }
}

export function parseContributors(contributors) {
  const mapping = {};
  const formattedContributors = [];

  // Here we take the incoming data and deduplicate
  contributors.map(contributor => {
    // map authors by author rolename in array
    if (contributor.roleName in mapping) {
      mapping[contributor.roleName].push(contributor);
    } else {
      mapping[contributor.roleName] = [contributor];
    }
  });

  for (const key in mapping) {
    if (mapping.hasOwnProperty(key)) {
      mapping[key].label = key;
      formattedContributors.push(mapping[key]);
    }
  }

  return formattedContributors;
}
