import { eval, exec } from '../../combinator/data/parser';
import { header as h } from '../header';

export function header(source: string): string {
  const result = h(source, {});
  const [el] = eval(result, []);
  return isValid(el)
    ? source.slice(0, source.length - exec(result, source).length)
    : '';
}

export function headers(source: string): string[] {
  const result = h(source, {});
  const [el] = eval(result, []);
  return isValid(el)
    ? el.lastChild!.textContent!.split(/[^\S\n]*\n/)
    : [];
}

function isValid(el: HTMLElement | undefined): el is HTMLElement {
  return !!el
      && el.classList.contains('header')
      && el.childNodes.length > 1;
}
