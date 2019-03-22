import {
  Component,
  OnInit,
  Injectable
} from '@angular/core';
import { accordionOpen } from '../../services/accordion.service';

export const companyResourcesSelector = 'company-resources';

@Component({
  selector: companyResourcesSelector,
  templateUrl: './company-resources.component.html',
})
@Injectable()
export class CompanyResourcesComponent implements OnInit {
  isLoaded = false;
  worldwide: any;
  resources: any;

  ngOnInit() {
    this.worldwide = {
      accordion: {
        toggle: false,
        chevron: 'chevron-down',
        heading: 'Penguin Random House Worldwide',
        id: 'worlwide',
      },
      links: [
        {
        seoFriendlyUrl: 'http://global.penguinrandomhouse.com',
        title: 'Penguin Random House',
      },
      {
        seoFriendlyUrl: 'http://global.penguinrandomhouse.com/company-history/',
        title: 'Company History',
      },
      {
        seoFriendlyUrl: 'http://global.penguinrandomhouse.com/offices/',
        title: 'Global Offices',
      },
      {
        seoFriendlyUrl: 'https://www.bertelsmann.com/',
        title: 'Bertelsmann',
      },
      ],
    };


    this.resources = {
      accordion: {
        toggle: false,
        chevron: 'chevron-down',
        heading: 'Resources',
        id: 'resources',
      },
      links: [
        {
        seoFriendlyUrl: 'https://authors.penguinrandomhouse.com/login?target=https://authors.penguinrandomhouse.com/' +
                        '&url=https%3A%2F%2Fidp2.penguinrandomhouse.com%2Fnidp%2Fidff%2Fsso%3Fsid%3D0%26sid%3D0%26id%3Das2prd',
        title: 'Author Portal',
      },
      {
        seoFriendlyUrl: '/penguin-random-house-canada-academic',
        title: 'Academic',
      },
      {
        seoFriendlyUrl: '/bookseller-services',
        title: 'Booksellers',
      },
      {
        seoFriendlyUrl: 'http://www.penguinrandomhouse.biz/',
        title: 'Business Services',
      },
      {
        seoFriendlyUrl: 'https://bnccatalist.ca/ViewPublisher.aspx?id=10051',
        title: 'Catalogues',
      },
      {
        seoFriendlyUrl: '/media',
        title: 'Media',
      },
      {
        seoFriendlyUrl: '/rights-and-permissions',
        title: 'Rights & Permissions',
      },
      {
        seoFriendlyUrl: '/penguin-random-house-canada-school-libraries',
        title: 'School & Libraries',
      },
      ],
    };

    this.isLoaded = true;
  }

  /**
   * Toggle the accordion on click
   *
   * @param {$event} accordion header click event.
   * @param {accordion} Accordion interface object.
   */
  accordionOpen(accordion) {
    accordionOpen(accordion);
  }

}


