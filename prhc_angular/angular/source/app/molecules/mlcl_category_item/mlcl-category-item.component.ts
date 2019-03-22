import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'mlcl-category-item',
  templateUrl: './mlcl-category-item.component.html',
})
export class MlclCategoryItemComponent implements OnInit {
  @Input() content: any;
  @Input() type: string;

  ngOnInit() {
    if (this.content) {
      // cover image validator
      if (!this.content.cover && this.content._links) {
        this.content._links.forEach(link => {
          if (link.rel === 'icon') {
            this.content.cover = link.href;
          }
        });
      }

      if (this.type === 'book') {
        this.content.subtitle = this.content.author;
      }
    }
  }
}
