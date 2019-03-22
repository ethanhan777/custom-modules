import {
  Component,
  OnInit,
  Injectable,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  OnDestroy
} from '@angular/core';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';
import { EnhancedApiService } from '../../services/enhanced_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const heroTwocolSelector = 'hero-two-col';

@Component({
  selector: heroTwocolSelector,
  templateUrl: './hero-two-col.component.html',
})
@Injectable()
export class HeroTwocolComponent implements OnInit, OnChanges, OnDestroy {
  @Input() content: any;
  hero: any;
  isLoaded = false;
  isDesc = true;
  hasCover = false;
  bookData: any;
  contentType: string;
  lightboxOn = false;
  audioClipOn = false;
  audioUrl: string;
  accordionId = 'book-details';
  currentImprint = false;
  currentContentInfo = getCurrentContentInfo();
  private subscriptions = new Subscriber();

  constructor( protected enhanced: EnhancedApiService ) {}

  ngOnInit() {
    switch (this.currentContentInfo.type) {
      case 'books':
        if (this.content) {
          this.hero = setBookContent(this.content);
          this.isLoaded = true;
        }
        break;
      case 'authors':
        this.subscriptions.add(
          this.enhanced
          .getAuthor(this.currentContentInfo.id, 'display')
          .subscribe(response => {
            response['data'].map(content => {
              this.hero = {
                title: content.display,
                hasCover: content.hasAuthorPhoto,
                image: content.photo,
                photoCredit: content.photoCredit,
                desc: content.spotlight,
              };
              this.accordionId = 'author-bio';
            });

            this.isLoaded = true;
          })
        );
        break;
      case 'imprints':
        this.subscriptions.add(
          this.enhanced
          .getImprint(this.currentContentInfo.id)
          .subscribe(response => {
            response['data'].map(content => {
              this.hero = {
                title: content.description,
              };
            });

            this.isLoaded = true;
          })
        );
        break;
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.content && changes.content.previousValue) {
      const newContent: SimpleChange = changes.content;
      this.hero = setBookContent(newContent.currentValue);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // turn on the lightbox
  buttonOnClick(buy?) {
    if (buy === true) {
      this.lightboxOn = true;
      document.getElementsByTagName('body')[0].classList.add('cmpnt_lightbox-open');
    }
  }

  // change the value of lightboxOn when the lightbox is closed
  lightboxOff(clickedValue) {
    this.lightboxOn = clickedValue;
    document.getElementsByTagName('body')[0].classList.remove('cmpnt_lightbox-open');
  }

  // turn on soundcloud
  audioButtonClick(listen?) {
    if (listen) {
      this.audioClipOn = true;
      this.audioUrl = listen;
    }
  }

}

export function setBookContent(content) {
  let excerptUrl;
  let audioExcerptUrl;
  let audioExcerptFormat;
  let audioExcerptCover;
  let readingGuideUrl;
  let hasInsight = false;

  if (
    content.readingGuide &&
    (content.readingGuide.discussion ||
      content.readingGuide.about ||
      content.readingGuide.copy ||
      content.readingGuide.authbio ||
      content.readingGuide.suggest)
  ) {
    readingGuideUrl = content.seoFriendlyUrl + '/reading-guide';
  }

  if (content.hasInsight) {
    hasInsight = true;
  }

  // set default(current format) audio excerpt link
  let excerptRelatedLinks;
  let formatName = content.format.name;
  let cover = content.cover;
  if (content.hasAudioExcerpt && content.excerptRelatedLinks) {
    excerptRelatedLinks = content.excerptRelatedLinks;
  }

  content.otherFormats.map(title => {
    // set excerpt link
    if (title.hasExcerpt && !excerptUrl) {
      excerptUrl = title.seoFriendlyUrl + '/excerpt';
    }

    // check if other formats have audio excerpt if current doesn't
    if (
      title.hasAudioExcerpt &&
      title.excerptRelatedLinks &&
      title.isbn !== content.isbn &&
      !content.hasAudioExcerpt
    ) {
      excerptRelatedLinks = title.excerptRelatedLinks;
      formatName = title.format.name;
      cover = title.cover;
    }

    if (excerptRelatedLinks) {
      for (const key in excerptRelatedLinks) {
        if (excerptRelatedLinks[key].linkAttr === 24000) {
          audioExcerptUrl = excerptRelatedLinks[key].url;
          audioExcerptFormat = formatName;
          audioExcerptCover = cover;
        }
      }
    }
  });

  return {
    title: content.title,
    author: content.author,
    subtitle: content.subtitle,
    hasCover: content.hasCoverImage,
    image: content.cover,
    series: content.series,
    contributors: content.contributors,
    desc: content.aboutTheBook,
    excerptUrl: excerptUrl,
    readingGuideUrl: readingGuideUrl,
    hasInsight: hasInsight,
    audioExcerptUrl: audioExcerptUrl,
    audioExcerptFormat: audioExcerptFormat,
    audioExcerptCover: audioExcerptCover,
    onSaleDate: content.onSaleDate,
    isbn: content.isbn,
    workId: content.workId,
    format: content.format,
    categories: content.categories,
    imprint: content.imprint
  };
}
