import { isFixed } from '../parser/inline';

export function suppress(target: HTMLElement): void {
  void target.querySelectorAll('[id]')
    .forEach(el =>
      !el.closest('.math') &&
      void el.removeAttribute('id'));
  void target.querySelectorAll('figure[class^="label:"]:not([data-index])')
    .forEach(el =>
      !isFixed(el.className) &&
      void el.setAttribute('class', el.getAttribute('class')!.split('-')[0] + '-0'));
  void target.querySelectorAll('a[href^="#"]')
    .forEach(el =>
      void el.setAttribute('onclick', 'return false;'));
}
