import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { convertStrToUrl } from '../../services/common.service';

@Component({
  selector: 'mlcl-campaign-category-heading',
  templateUrl: './mlcl-campaign-category-heading.component.html',
})
export class MlclCampaignCategoryHeadingComponent implements OnInit {
  @Input() detail;
  categoryTitle: string;
  categorySubheading: string;
  categoryIntro: string;
  categoryId = '';

  ngOnInit() {
    if (this.detail) {
      if (this.detail.attributes.field_nav_title) {
        this.categoryId = convertStrToUrl(this.detail.attributes.field_nav_title);
      }
      this.categoryTitle = this.detail.attributes.field_category_title;
      this.categorySubheading = this.detail.attributes.field_subheading;
      // fallback where old field is intro_text and new wysiwyg field is paragraph
      if (this.detail.attributes.field_paragraph) {
        this.categoryIntro = this.detail.attributes.field_paragraph.processed;
      } else if (this.detail.attributes.field_paragraph === null && this.detail.attributes.field_intro_text) {
        this.categoryIntro = this.detail.attributes.field_intro_text;
      }
    }
  }
}

