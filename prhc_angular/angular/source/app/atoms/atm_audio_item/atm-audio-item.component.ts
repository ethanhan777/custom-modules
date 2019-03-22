import {
  Component,
  OnInit,
  Injectable,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { getAudioKey } from '../../services/common.service';

@Component({
  selector: 'atm-audio-item',
  templateUrl: './atm-audio-item.component.html',
})
@Injectable()
export class AtmAudioItemComponent implements OnInit {
  @Input() audioUrl: string;
  @Input() audioFormatName: string;
  @Input() audioFormatCover: string;
  @Input() title: string;
  audioSrc: any;
  @Output() audioOpen = new EventEmitter<any>();

  constructor ( private _sanitizer: DomSanitizer ) {}

  ngOnInit() {
    const audio = getAudioKey(this.audioUrl);
    let rawAudioSrc: string;
    const proto = window.location.protocol;

    if (audio.soundcloud) {
      rawAudioSrc = proto +
        '//w.soundcloud.com/player/?url=' +
        proto + '//soundcloud.com/' +
        audio.soundcloud + '&color=%23000000&auto_play=true&show_artwork=false';
    }

    this.audioSrc = this._sanitizer.bypassSecurityTrustResourceUrl(rawAudioSrc);
  }

}
