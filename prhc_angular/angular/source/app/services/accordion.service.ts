import { scrollToClass } from './scroll.service';

/**
 * Toggle the accordion on click
 *
 * @param {id} accordion id
 */
export function accordionOpen(accordion) {
  accordion.toggle = !accordion.toggle;
  // Toggle the up/down chevron
  if (accordion.toggle === true) {
    accordion.chevron = 'chevron-up';
  } else {
    accordion.chevron = 'chevron-down';
  }

  // scroll to the top of the accordion
  scrollToClass('accordion-section-' + accordion.id);
}
