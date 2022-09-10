import { undefined, Infinity, Map, Node } from 'spica/global';
import { text } from '../inline/extension/indexee';
import { frag, html, define } from 'typed-dom/dom';
import { MultiMap } from 'spica/multimap';
import { querySelectorAll } from 'typed-dom/query';

export function* footnote(
  target: ParentNode & Node,
  footnotes?: { readonly annotations?: HTMLOListElement; readonly references: HTMLOListElement; },
  opts: { readonly id?: string; } = {},
  bottom: Node | null = null,
): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
  // Bug: Firefox
  //querySelectorAll(target, `:scope > .annotations`).forEach(el => el.remove());
  for (let es = querySelectorAll(target, `.annotations`), i = 0; i < es.length; ++i) {
    const el = es[i];
    el.parentNode === target && el.remove();
  }
  yield* reference(target, footnotes?.references, opts, bottom);
  yield* annotation(target, footnotes?.annotations, opts, bottom);
  return;
}

export const annotation = build('annotation', n => `*${n}`, 'h1, h2, h3, h4, h5, h6, aside.aside, hr');
export const reference = build('reference', (n, abbr) => `[${abbr || n}]`);

function build(
  syntax: 'annotation' | 'reference',
  marker: (index: number, abbr: string | undefined) => string,
  splitter?: string,
) {
  assert(syntax.match(/^[a-z]+$/));
  // Referenceを含むAnnotationの重複排除は両構文が互いに処理済みであることを必要とするため
  // 構文ごとに各1回の処理では不可能
  return function* (
    target: ParentNode & Node,
    footnote?: HTMLOListElement,
    opts: { readonly id?: string } = {},
    bottom: Node | null = null,
  ): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
    const defs = new Map<string, HTMLLIElement>();
    const buffer = new MultiMap<string, HTMLElement>();
    const titles = new Map<string, string>();
    // Bug: Firefox
    //const splitters = push([], querySelectorAll(target, `:scope > :is(${splitter ?? '_'})`));
    const splitters: Element[] = [];
    for (let es = querySelectorAll(target, splitter ?? '_'), i = 0; i < es.length; ++i) {
      const el = es[i];
      el.parentNode === target && splitters.push(el);
    }
    let count = 0;
    let total = 0;
    let style: 'count' | 'abbr';
    for (
      let refs = querySelectorAll(target, `sup.${syntax}:not(.disabled)`),
          i = 0, len = refs.length; i < len; ++i) {
      yield;
      const ref = refs[i];
      while (+splitters[0]?.compareDocumentPosition(ref) & Node.DOCUMENT_POSITION_FOLLOWING) {
        if (defs.size > 0) {
          total += defs.size;
          yield* proc(defs, target.insertBefore(html('ol', { class: `${syntax}s` }), splitters[0] ?? null));
        }
        splitters.shift();
      }
      const identifier = `${+!ref.querySelector('.label')}:${ref.getAttribute('data-abbr') || '_' + ref.firstElementChild!.innerHTML}`;
      const abbr = ref.getAttribute('data-abbr') || undefined;
      const content = frag(ref.firstElementChild!.cloneNode(true).childNodes);
      style ??= abbr ? 'abbr' : 'count';
      if (style === 'count' ? abbr : !abbr) {
        define(ref, {
          class: void ref.classList.add('invalid'),
          'data-invalid-syntax': syntax,
          'data-invalid-type': 'style',
          'data-invalid-message': `${syntax[0].toUpperCase() + syntax.slice(1)} style must be consistent`,
        });
      }
      else if (ref.getAttribute('data-invalid-type') === 'style') {
        define(ref, {
          class: void ref.classList.remove('invalid'),
          'data-invalid-syntax': null,
          'data-invalid-type': null,
          'data-invalid-message': null,
        });
      }
      if (!ref.firstElementChild!.hasAttribute('hidden')) {
        ref.firstElementChild!.setAttribute('hidden', '');
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
      assert(syntax !== 'annotation' || title);
      title
        ? !titles.has(identifier) && titles.set(identifier, title)
        : buffer.set(identifier, ref);
      assert(syntax !== 'annotation' || !buffer.has(identifier));
      const blank = !!abbr && !content.firstChild;
      const refIndex = ++count;
      const refId = opts.id !== ''
        ? ref.id || `${syntax}:${opts.id ? `${opts.id}:` : ''}ref:${refIndex}`
        : undefined;
      const def = undefined
        || defs.get(identifier)
        || defs.set(identifier, html('li',
            {
              id: opts.id !== '' ? `${syntax}:${opts.id ? `${opts.id}:` : ''}def:${total + defs.size + 1}` : undefined,
              'data-marker': !footnote ? marker(total + defs.size + 1, abbr) : undefined,
            },
            [content.cloneNode(true), html('sup')]))
            .get(identifier)!;
      assert(def.lastChild);
      if (title && !blank && def.childNodes.length === 1) {
        def.insertBefore(content.cloneNode(true), def.lastChild);
        assert(def.childNodes.length > 1);
        for (let refs = buffer.take(identifier, Infinity), i = 0; i < refs.length; ++i) {
          const ref = refs[i];
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
      const defIndex = +def.id.slice(def.id.lastIndexOf(':') + 1) || total + defs.size;
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
    if (defs.size > 0 || footnote) {
      yield* proc(defs, footnote ?? target.insertBefore(html('ol', { class: `${syntax}s` }), splitters[0] ?? bottom));
    }
    return;
  }

  function* proc(defs: Map<string, HTMLLIElement>, footnote: HTMLOListElement): Generator<HTMLLIElement | undefined, undefined, undefined> {
    const { children } = footnote;
    const size = defs.size;
    let count = 0;
    let length = children.length;
    I:
    for (const [key, def] of defs) {
      defs.delete(key);
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
