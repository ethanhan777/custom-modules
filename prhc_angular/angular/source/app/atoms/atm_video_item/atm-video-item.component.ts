import {
  Component,
  OnInit,
  Injectable,
  Input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { getVideoKey } from '../../services/common.service';

@Component({
  selector: 'atm-video-item',
  templateUrl: './atm-video-item.component.html',
})
@Injectable()
export class AtmVideoItemComponent implements OnInit {
  @Input() videoUrl: string;
  @Input() videoText: string;
  videoSrc: any;

  constructor ( private _sanitizer: DomSanitizer ) {}

  ngOnInit() {
    const video = getVideoKey(this.videoUrl);
    let rawVideoSrc: string;
    const proto = window.location.protocol;

    if (video.youtube) {
      rawVideoSrc = proto + '//www.youtube.com/embed/' + video.youtube + '?enablejsapi=1';
    }
    if (video.vimeo) {
      rawVideoSrc = '//player.vimeo.com/video/' + video.vimeo;
    }
    this.videoSrc = this._sanitizer.bypassSecurityTrustResourceUrl(rawVideoSrc);
  }

}
