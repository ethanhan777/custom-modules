import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import { getYearRaw } from '../../services/date_format.service';
import { TealiumUtagService } from '../../services/utag.service';

export const footerNavSelector = 'footer-nav';

@Component({
  selector: footerNavSelector,
  templateUrl: './footer-nav.component.html',
})
@Injectable()
export class FooterNavComponent implements OnInit {
  copyrightYear: number;
  logoImage = {
    path: '/themes/custom/penguin/images/logos/global-logo.png',
    alt: 'Penguin Random House Logo',
  };
  socialNavItems = [
    {
      name: 'facebook',
      url: '#',
    },
    {
      name: 'instagram',
      url: '#',
    },
    {
      name: 'twitter',
      url: '#',
    },
    {
      name: 'envelope-o',
      url: '#',
    },
  ];

  footerLinks = [
    {
      links: [
        {
          name: 'About',
          url: '/about',
        },
        {
          name: 'Privacy Policy',
          url: '/privacy-policy',
        },
        {
          name: 'Accessibility Policy',
          url: '/accessibility-policy',
        },
        {
          name: 'Terms of Use',
          url: '/terms-use',
        },
      ],
    },
    {
      links: [
        {
          name: 'Author Portal',
          url: 'https://authors.penguinrandomhouse.com/login?target=https://authors.penguinrandomhouse.com/' +
            '&url=https%3A%2F%2Fidp2.penguinrandomhouse.com%2Fnidp%2Fidff%2Fsso%3Fsid%3D0%26sid%3D0%26id%3Das2prd',
        },
        {
          name: 'Academic',
          url: '/penguin-random-house-canada-academic',
        },
        {
          name: 'Booksellers',
          url: '/bookseller-services',
        },
        {
          name: 'Catalogues',
          url: 'https://bnccatalist.ca/ViewPublisher.aspx?id=10051',
        },
      ],
    },
    {
      links: [
        {
          name: 'Media',
          url: '/media',
        },
        {
          name: 'Rights & Permissions',
          url: '/rights-and-permissions',
        },
        {
          name: 'School & Libraries',
          url: '/penguin-random-house-canada-school-libraries',
        },
      ],
    },
  ];

  constructor ( private tealium: TealiumUtagService ) {}

  ngOnInit() {
    this.copyrightYear = getYearRaw(new Date());
  }

  onClick(linkName) {
    this.tealium.track('link', {
      'module_type' : 'Footer',
      'module_variation' : linkName,
    });
  }
}
