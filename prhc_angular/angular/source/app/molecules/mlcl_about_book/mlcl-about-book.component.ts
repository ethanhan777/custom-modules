import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'mlcl-about-book',
  templateUrl: './mlcl-about-book.component.html',
})
export class MlclAboutBookComponent implements OnInit {
  @Input() title: any;
  @Input() heading: string;
  flapcopy: string;
  links = [];

  ngOnInit() {
    if (this.title) {
      if (!this.title.cover) {
        this.title.cover =
          'https://images.randomhouse.com/cover/' + this.title.isbn;
      }

      if (this.title._embeds && this.title._embeds[0].content.flapcopy) {
        this.flapcopy = this.title._embeds[0].content.flapcopy;
      }

      // set read more button
      const link = {
        label: 'Read More',
        seoFriendlyUrl: this.title.seoFriendlyUrl,
      };
      this.links.push(link);
    }
  }
}
