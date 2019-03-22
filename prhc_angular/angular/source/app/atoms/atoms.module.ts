import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';

import { AtmButtonComponent } from './atm_button/atm-button.component';
import { AtmContentParagraphComponent } from './atm_content_paragraph/atm-content-paragraph.component';
import { AtmContributorComponent } from './atm_contributor/atm-contributor.component';
import { AtmInlineImageComponent } from './atm_inline_image/atm-inline-image.component';
import { AtmSocialLabelComponent } from './atm_social_label/atm-social-label.component';
import { AtmSocialLinkComponent } from './atm_social_link/atm-social-link.component';
import { AtmTourComponent } from './atm_on_tour/atm-on-tour.component';
import { AtmSubheadingComponent } from './atm_subheading/atm-subheading.component';
import { AtmTagComponent } from './atm_tag/atm-tag.component';
import { AtmVideoItemComponent } from './atm_video_item/atm-video-item.component';
import { AtmBuyButtonComponent } from './atm_buy_button/atm-buy-button.component';
import { AtmAudioItemComponent } from './atm_audio_item/atm-audio-item.component';
import { AtmSaveButtonComponent } from './atm_save_button/atm-save-button.component';

const declarations = [
  AtmButtonComponent,
  AtmContentParagraphComponent,
  AtmContributorComponent,
  AtmInlineImageComponent,
  AtmSocialLabelComponent,
  AtmSocialLinkComponent,
  AtmTourComponent,
  AtmSubheadingComponent,
  AtmTagComponent,
  AtmVideoItemComponent,
  AtmBuyButtonComponent,
  AtmAudioItemComponent,
  AtmSaveButtonComponent,
];

@NgModule({
  imports: [CommonModule,
  Angular2FontawesomeModule
  ],
  exports: [...declarations],
  declarations,
})
export class AtomsModule {}
