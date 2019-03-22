import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  Injectable
} from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';

import {
  PrhcApiService,
  parseNavLinks
} from '../../services/prhc_api.service';
import { TealiumUtagService } from '../../services/utag.service';

export const mainNavSelector = 'main-nav';

@Component({
  selector: mainNavSelector,
  templateUrl: './main-nav.component.html',
})
@Injectable()
export class MainNavComponent implements OnInit, OnDestroy {
  navOpen = false;
  navWidth = 0;
  searchOpen = false;
  searchTerm;
  clickCount = 0;
  screenWidth: number;
  savedData = localStorage.getItem('prhc-saved-books');

  logo = {
    path: '/themes/custom/penguin/images/logos/prh-logo.svg',
    alt: 'Penguin Random House Canada Logo',
  };

  primaryNavItems = [];
  secondaryNavItems = [
    [{
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
    }],
  ];
  private subscriptions = new Subscriber();

  constructor (
    private prhcApi: PrhcApiService,
    private tealium: TealiumUtagService,
  ) {
    this.screenWidth = window.screen.width;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = event.target.innerWidth;
  }

  ngOnInit() {
    this.subscriptions.add(
      this.prhcApi
        .getMainNavItems('main')
        .map(parseNavLinks)
        .subscribe (response => {
          if (response && response.length) {
            this.primaryNavItems = response;
          }
        })
    );

    this.subscriptions.add(
      this.prhcApi
        .getMainNavItems('secondary-nav')
        .map(parseNavLinks)
        .subscribe (response => {
          if (response && response.length) {
            this.secondaryNavItems.unshift(response);
          }
        })
    );

    const currentPath = window.location.pathname;

    if (
      currentPath.split('/')[1] === 'books' &&
      window.location.hash
    ) {
      window.history.pushState('', '', currentPath);
    }
    document.addEventListener('click', () => {
      this.navOpen = false;
      const bodyEl = document.getElementsByTagName('body')[0];
      bodyEl.style.marginLeft = 0 + 'px';
      bodyEl.classList.remove('nav-open');
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Toggle the navigation
   */
  mainNavToggle(navItemName?, isMain?) {
    if (navItemName) {
      this.tealium.track('link', {
        'module_type' : 'Navigation',
        'module_variation' : navItemName,
      });
    }

    if (!isMain || this.screenWidth <= 1024) {
      // TODO: replace document.getElementsByClassName with viewChild and elelmentRef
      // Get the width of the nav
      this.navOpen = !this.navOpen;
      const bodyEl = document.getElementsByTagName('body')[0];
      if (this.navOpen) {
        // Push the body of the page to the left the same amount as the width of the nav
        bodyEl.style.marginLeft = '250px';
        bodyEl.style['-webkit-transform'] = 'translate3d(0, 0, 0)';
        bodyEl.classList.add('nav-open');
      } else {
        bodyEl.style.marginLeft = 0 + 'px';
        bodyEl.classList.remove('nav-open');
      }
    }
  }

  // get the search value from the search-bar-global component
  searchInput(value) {
    if (value) {
      this.searchTerm = value;
    }
  }

  /**
   * Show the search text field when icon is clicked
   */
  searchOn() {
    this.clickCount++;
    if (this.clickCount === 1) {
      // Show the text field on the first click
      this.searchOpen = true;
    } else if (this.clickCount === 2) {
      // search for the term on the second click or by hitting enter
      window.location.href = '/search/?q=' + this.searchTerm;
    }
  }

  keepNavOpen(event) {
    event.stopPropagation();
  }
}
