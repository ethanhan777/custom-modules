import {
  Component,
  Injectable,
  OnInit,
} from '@angular/core';

export const aboutPrhcSelector = 'about-prhc';

@Component({
  selector: aboutPrhcSelector,
  templateUrl: './about-prhc.component.html',
})
@Injectable()

export class AboutPrhcComponent implements OnInit {
  aboutPageData = [
  {
    seoFriendlyUrl: '/contact-us',
    title: 'Contact Us',
  },
  {
    seoFriendlyUrl: '/careers',
    title: 'Careers',
  },
  {
    seoFriendlyUrl: '/news',
    title: 'News',
  },
  {
    seoFriendlyUrl: '/events',
    title: 'Events',
  }
];

  ngOnInit() {

  }
}
