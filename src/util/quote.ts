import { location } from 'spica/global';
import { URL } from 'spica/url';
import { define } from 'typed-dom';

const { origin } = location;

export function quote(range: Range): string {
  const expansion = expand(range);
  const node = range.cloneContents();
  for (let es = node.querySelectorAll('code[data-src], .math[data-src], rt, rp, .media'), i = 0, len = es.length; i < len; ++i) {
    const el = es[i];
    switch (true) {
      case el.matches('code'):
      case el.matches('.math'):
        define(el, el.getAttribute('data-src')!);
        continue;
      case el.matches('rt, rp'):
        el.remove();
        continue;
      case el.matches('.media'):
        el.replaceWith(`!${new URL(el.getAttribute('data-src')!, origin).reference}`);
        continue;
    }
  }
  node.prepend(expansion ? '>' : '> ');
  for (let es = node.querySelectorAll('br'), i = 0, len = es.length; i < len; ++i) {
    const el = es[i];
    const target = el.nextSibling as Node | Element;
    el.replaceWith(target && 'id' in target && target.matches('.quotation') ? '\n>' : '\n> ');
  }
  return node.textContent!.replace(/^>*\s*(?:\n|$)/gm, '');
}

function expand(range: Range): boolean {
  const node = range.startContainer;
  const offset = range.startOffset;
  if (!node.parentElement?.matches('.quotation, .quotation > .address:first-child')) return false;
  if (!/^>+$/.test(node.textContent!.slice(0, offset + 1))) return false;
  switch (true) {
    case node.parentElement?.matches('.address')
      && /^>*$/.test(node.parentElement.previousSibling?.textContent!.slice(0, offset) || ''):
      range.setStart(node.parentElement.previousSibling!, 0);
      return true;
    case node.previousSibling === null
      && /^>*$/.test(node.textContent!.slice(0, offset)):
      range.setStart(node, 0);
      return true;
    default:
      return false;
  }
}
