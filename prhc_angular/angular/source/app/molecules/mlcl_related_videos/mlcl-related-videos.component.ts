import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'mlcl-related-videos',
  templateUrl: './mlcl-related-videos.component.html',
})
export class MlclRelatedVideosComponent {
  @Input() videos = [];
}
