import { undefined, Infinity, Map, WeakMap } from 'spica/global';
import { text } from '../inline/extension/indexee';
import { frag, html, define } from 'typed-dom/dom';
import { MultiMap } from 'spica/multimap';
import { memoize } from 'spica/memoize';

export function* footnote(
  target: ParentNode & Node,
  footnotes?: Readonly<{ annotations: HTMLOListElement; references: HTMLOListElement; }>,
  opts: Readonly<{ id?: string; }> = {},
): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
  yield* reference(target, footnotes?.references, opts, footnotes?.annotations && [footnotes.annotations]);
  yield* annotation(target, footnotes?.annotations, opts, []);
  return;
}

export const annotation = build('annotation', n => `*${n}`);
export const reference = build('reference', (n, abbr) => `[${abbr || n}]`);

function build(
  syntax: string,
  marker: (index: number, abbr: string | undefined) => string,
) {
  assert(syntax.match(/^[a-z]+$/));
  // Referenceを含むAnnotationの重複排除は両構文が互いに処理済みであることを必要とするため
  // 構文ごとに各1回の処理では不可能
  const identify = memoize<HTMLElement, string>(
    ref => `${+!ref.querySelector('.label')}:${ref.getAttribute('data-abbr') || '_' + ref.innerHTML}`,
    new WeakMap());
  const contentify = memoize<HTMLElement, DocumentFragment>(
    ref => frag(ref.cloneNode(true).childNodes),
    new WeakMap());
  return function* (
    target: ParentNode & Node,
    footnote?: HTMLOListElement,
    opts: Readonly<{ id?: string }> = {},
    footnotes: readonly HTMLOListElement[] = [],
  ): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
    const defs = new Map<string, HTMLLIElement>();
    const buffer = new MultiMap<string, HTMLElement>();
    const titles = new Map<string, string>();
    const check = footnotes.some(el => target.contains(el));
    let style: 'count' | 'abbr';
    for (
      let refs = target.querySelectorAll<HTMLElement>(`sup.${syntax}:not(.disabled)`),
          i = 0, len = refs.length; i < len; ++i) {
      yield;
      const ref = refs[i];
      if (check && footnotes.some(el => el.contains(ref))) continue;
      const identifier = identify(ref);
      const abbr = ref.getAttribute('data-abbr') || undefined;
      const content = contentify(ref);
      style ??= abbr ? 'abbr' : 'count';
      if (style === 'count' ? abbr : !abbr) {
        define(ref, {
          class: void ref.classList.add('invalid'),
          'data-invalid-syntax': syntax,
          'data-invalid-type': 'style',
          'data-invalid-message': `${syntax[0].toUpperCase() + syntax.slice(1)} style must be consistent`,
        });
      }
      if (ref.firstElementChild?.getAttribute('hidden') !== '') {
        ref.replaceChildren(html('span', { hidden: '' }, ref.childNodes));
      }
      else {
        ref.lastChild?.remove();
      }
      const title = undefined
        || titles.get(identifier)
        || +identifier[0] && ref.title
        || text(content).trim()
        || content.textContent!.trim()
        || undefined;
      title
        ? !titles.has(identifier) && titles.set(identifier, title)
        : buffer.set(identifier, ref);
      const blank = !!abbr && !content.firstChild;
      const refIndex = i + 1;
      const refId = opts.id !== ''
        ? ref.id || `${syntax}:${opts.id ? `${opts.id}:` : ''}ref:${refIndex}`
        : undefined;
      const def = undefined
        || defs.get(identifier)
        || defs.set(identifier, html('li',
            { id: opts.id !== '' ? `${syntax}:${opts.id ? `${opts.id}:` : ''}def:${defs.size + 1}` : undefined },
            [content.cloneNode(true), html('sup')]))
            .get(identifier)!;
      assert(def.lastChild);
      if (title && !blank && def.childNodes.length === 1) {
        def.insertBefore(content.cloneNode(true), def.lastChild);
        assert(def.childNodes.length > 1);
        for (const ref of buffer.take(identifier, Infinity)) {
          if (ref.getAttribute('data-invalid-type') !== 'content') continue;
          define(ref, {
            title,
            class: void ref.classList.remove('invalid'),
            'data-invalid-syntax': null,
            'data-invalid-type': null,
            'data-invalid-message': null,
          });
        }
      }
      const defIndex = +def.id.slice(def.id.lastIndexOf(':') + 1) || defs.size;
      const defId = def.id || undefined;
      define(ref, {
        id: refId,
        class: opts.id !== '' ? undefined : `${ref.className} disabled`,
        ...title
          ? { title }
          : { class: void ref.classList.add('invalid'),
              'data-invalid-syntax': syntax,
              'data-invalid-type': 'content',
              'data-invalid-message': 'Missing the content',
            },
      });
      yield ref.appendChild(html('a', { href: refId && defId && `#${defId}` }, marker(defIndex, abbr)));
      assert(ref.title || ref.matches('.invalid'));
      def.lastChild!.appendChild(
        html('a',
          {
            href: refId && `#${refId}`,
            title: abbr && !blank
              ? title
              : undefined,
          },
          `^${refIndex}`));
    }
    if (!footnote) return;
    const { children } = footnote;
    const size = defs.size;
    let count = 0;
    let length = children.length;
    I:
    for (const def of defs.values()) {
      ++count;
      while (length > size) {
        const node = children[count - 1] as HTMLLIElement;
        if (equal(node, def)) continue I;
        yield footnote.removeChild(node);
        --length;
        assert(children.length === length);
      }
      const node = count <= length
        ? children[count - 1]
        : null;
      if (node && equal(node, def)) continue;
      assert(def.parentNode !== footnote);
      yield footnote.insertBefore(def, node);
      ++length;
      assert(children.length === length);
    }
    while (length > size) {
      yield footnote.removeChild(children[size] as HTMLLIElement);
      --length;
      assert(children.length === length);
    }
    return;
  }
}

function equal(a: Element, b: HTMLElement): boolean {
  return a.id === b.id
      && a.innerHTML === b.innerHTML;
}
