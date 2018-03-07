import { text } from '../parser/block/util/indexer';
import { TypedHTML, html } from "typed-dom";

const annotation = new WeakMap<HTMLElement, Node[]>();
const reference = new WeakMap<HTMLElement, HTMLElement>();

export function footnote(source: DocumentFragment | HTMLElement, target: HTMLOListElement): void {
  return void TypedHTML.ol([...source.querySelectorAll<HTMLElement>('.annotation')]
    .map((el, i) => {
      !annotation.has(el) && void annotation.set(el, [...el.childNodes]);
      reference.has(el) && void reference.get(el)!.remove();
      void defineTitle(el);
      void defineId(el, i + 1);
      const id = `footnote:${i + 1}:${description(el.getAttribute('title')!)}`;
      void reference.set(el, el.appendChild(html('a', { href: `#${id}`, rel: 'noopener' }, `${i + 1}`)));
      return TypedHTML.li(() => html('li', { id }, [
        ...annotation.get(el)!,
        html('sup', [
          html('a', { href: `#${el.id}`, rel: 'noopener' }, el.lastChild!.textContent!),
        ]),
      ]));
    }), () => target).element;
}

function defineTitle(target: HTMLElement): void {
  if (target.hasAttribute('title')) return;
  void target.setAttribute('title', text(target));
}

function defineId(target: HTMLElement, index: number): void {
  if (target.hasAttribute('id')) return;
  void target.setAttribute('id', `annotation:${index}:${description(target.getAttribute('title')!)}`);
}

function description(str: string): string {
  str = str.replace(/\s/g, '_');
  return str.slice(0, 15) + '.'.repeat(str.slice(15, 18).length);
}
