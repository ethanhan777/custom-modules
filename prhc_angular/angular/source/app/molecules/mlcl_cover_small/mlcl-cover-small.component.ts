import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'mlcl-cover-small',
  templateUrl: './mlcl-cover-small.component.html',
})
export class MlclCoverSmallComponent implements OnInit {
  coverImages: string[] = [];
  gridImageFallback = '';
  fallbackImage = '';
  @Input() cover;
  @Input() width;
  @Input() height;
  @Input() title;
  @Input() seoFriendlyUrl;
  @Input() sealFlag = false;

  ngOnInit() {
    // Array of fallback images
    // TODO: make URLs safe for Angular
    const noImagePatterns = [
      '\'../../../../themes/custom/penguin/images/no-image-fallback/no-image-pattern-1.png\'',
      '\'../../../../themes/custom/penguin/images/no-image-fallback/no-image-pattern-2.png\'',
      '\'../../../../themes/custom/penguin/images/no-image-fallback/no-image-pattern-3.png\'',
      '\'../../../../themes/custom/penguin/images/no-image-fallback/no-image-pattern-4.png\'',
      '\'../../../../themes/custom/penguin/images/no-image-fallback/no-image-pattern-5.png\'',
      '\'../../../../themes/custom/penguin/images/no-image-fallback/no-image-pattern-6.png\'',
    ];

    // Randomly choose a fallback image
    this.fallbackImage = noImagePatterns[Math.floor(Math.random() * noImagePatterns.length)];

    if (!this.cover) {
      this.gridImageFallback = 'mlcl_grid-no-image';
    } else {
      if (this.width) {
        this.cover += '?width=' + this.width;
      } else if (this.height) {
        this.cover += '?height=' + this.height;
      } else {
        this.cover += '?height=225';
      }
    }
  }
}
