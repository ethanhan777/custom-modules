import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  Injectable
} from '@angular/core';
import { EnhancedApiService } from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

@Component({
  selector: 'mlcl-about-author',
  templateUrl: './mlcl-about-author.component.html',
})
@Injectable()
export class MlclAboutAuthorComponent implements OnInit, OnDestroy {
  @Input() author;
  @Input() type;
  @Input() heading: string;
  @Input() authorPhotoFlag: boolean;
  @Output() hasAuthorPhoto = new EventEmitter<any>();
  readMoreLink: any;
  private subscriptions = new Subscriber();

  constructor( private enhanced: EnhancedApiService ) {}

  ngOnInit() {
    // author photo
    this.subscriptions.add(
      this.enhanced
        .hasAuthorPhoto(this.author.authorId)
        .subscribe(authorPhoto => {
          if (authorPhoto) {
            this.author.authorPhoto = authorPhoto;
          } else {
            this.hasAuthorPhoto.emit(false);
          }
        })
    );

    // author link
    if (this.author.spotlight) {
      this.readMoreLink = {
        label: 'Read More',
        seoFriendlyUrl: this.author.seoFriendlyUrl,
      };
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
