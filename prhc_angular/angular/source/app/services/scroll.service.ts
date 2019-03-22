/**
 * set where to scroll to
 *
 * @param {className} classname to scroll to
 */
export function scrollToClass(className) {
  const elements = document.getElementsByClassName(className);

  if (!elements.length) {
    return;
  }

  elements[0].scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  });
}
