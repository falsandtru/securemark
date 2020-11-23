import { location } from 'spica/global';
import { ReadonlyURL } from 'spica/url';
import { define } from 'typed-dom';

export function quote(address: string, range: Range): string {
  let expansion = expand(range);
  const node = range.cloneContents();
  const base = location.href;
  for (let es = node.querySelectorAll('code[data-src], .math[data-src], .media[data-src], rt, rp'), i = 0, len = es.length; i < len; ++i) {
    const el = es[i];
    switch (true) {
      case el.matches('code'):
      case el.matches('.math'):
        define(el, el.getAttribute('data-src')!);
        continue;
      case el.matches('.media'):
        el.replaceWith(`!{ ${new ReadonlyURL(el.getAttribute('data-src')!, base).href} }`);
        continue;
      case el.matches('rt, rp'):
        el.remove();
        continue;
    }
  }
  expansion = expansion || !!trim(node).firstElementChild?.matches('.quotation');
  if (!node.firstChild) return '';
  let add: boolean;
  if (expansion) {
    node.prepend('>');
    add = true;
  }
  else {
    node.prepend(`>>${address}\n> `);
    add = false;
  }
  for (let es = node.querySelectorAll('br'), i = 0, len = es.length; i < len; ++i) {
    const el = es[i];
    const target = el.nextSibling as Node | Element;
    if (target && 'id' in target && target.matches('.quotation')) {
      el.replaceWith('\n>');
      add = add || i < len - 1;
    }
    else {
      el.replaceWith(add ? `\n>>${address}\n> ` : '\n> ');
      add = false;
    }
  }
  add && node.append(`\n>>${address}`);
  return node.textContent!;
}

function expand(range: Range): boolean {
  const node = range.startContainer;
  if (node.parentElement?.matches('.quotation > .address:first-child')) {
    range.setStart(node.parentElement.previousSibling!, 0);
    return true;
  }
  const offset = range.startOffset;
  if (node.parentElement?.matches('.quotation') && node.textContent!.slice(0, offset) === '>'.repeat(offset)) {
    range.setStart(node, 0);
    return true;
  }
  return false;
}

function trim<T extends Node>(node: T): T {
  for (let child: ChildNode | null; child = node.firstChild;) {
    if (child.textContent) break;
    child.remove();
  }
  return node;
}
