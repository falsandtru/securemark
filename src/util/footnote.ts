import { text } from '../parser/block/indexer';
import { concat } from 'spica/concat';
import { TypedHTML, html } from 'typed-dom';

const annotation = new WeakMap<HTMLElement, Node[]>();
const reference = new WeakMap<HTMLElement, HTMLElement>();

export function footnote(source: DocumentFragment | HTMLElement, target: HTMLOListElement): void {
  const footnotes = new Map<string, HTMLLIElement>();
  return void TypedHTML.ol([...source.querySelectorAll<HTMLElement>('.annotation')]
    .reduce<HTMLLIElement[]>((acc, el, i) => {
      !annotation.has(el) && void annotation.set(el, [...el.childNodes]);
      reference.has(el) && void reference.get(el)!.remove();
      void defineTitle(el);
      const title = el.getAttribute('title')!;
      void defineId(el, i + 1);
      const fn = footnotes.get(title);
      const index = fn
        ? +fn.getAttribute('id')!.match(/\d+/)![0]
        : acc.length + 1;
      const id = fn
        ? fn.getAttribute('id')!
        : `footnote:${index}:${description(title)}`;
      assert(id.startsWith('footnote:'));
      void reference.set(el, el.appendChild(html('a', { href: `#${id}`, rel: 'noopener' }, `[${index}]`)));
      return fn
        ? (() => {
            void fn.lastChild!
              .appendChild(html('a', { href: `#${el.id}`, rel: 'noopener' }, `[${i + 1}]`));
            void [...annotation.get(el)!]
              .forEach(node =>
                node.parentNode === el &&
                void el.removeChild(node));
            return acc;
          })()
        : concat(acc, [html('li', { id }, [
            ...annotation.get(el)!,
            html('sup', [
              html('a', { href: `#${el.id}`, rel: 'noopener' }, `[${i + 1}]`),
            ]),
          ])].map(el => void footnotes.set(title, el) || el));
    }, [])
    .map(el => TypedHTML.li(() => el)),
    () => target).element;
}

function defineTitle(target: HTMLElement): void {
  if (target.hasAttribute('title')) return;
  void target.setAttribute('title', text(target));
}

function defineId(target: HTMLElement, index: number): void {
  if (target.hasAttribute('id')) return;
  void target.setAttribute('id', `annotation:${index}:${description(target.getAttribute('title')!)}`);
}

function description(text: string): string {
  text = text.replace(/\s/g, '_');
  return text.slice(0, 15).toLowerCase() + '.'.repeat(text.slice(15, 18).length);
}
