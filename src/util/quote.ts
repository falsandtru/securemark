import { Element } from 'spica/global';
import { exec } from '../combinator/data/parser';
import { cite } from '../parser/block/reply/cite';
import { define } from 'typed-dom/dom';
import { duffEach } from 'spica/duff';

export function quote(anchor: string, range: Range): string {
  if (exec(cite({ source: `>>${anchor}`, context: {} })) !== '') throw new Error(`Invalid anchor: ${anchor}`);
  fit(range);
  const node = trim(range.cloneContents());
  if (!node.firstChild) return '';
  duffEach(node.querySelectorAll('code[data-src], .math[data-src], .media[data-src], rt, rp'), el => {
    switch (true) {
      case el.matches('code'):
      case el.matches('.math'):
        define(el, el.getAttribute('data-src')!);
        return;
      case el.matches('.media'):
        el.replaceWith(
          /[\s{}]/.test(el.getAttribute('data-src')!)
            ? `!{ ${el.getAttribute('data-src')} }`
            : `!{${el.getAttribute('data-src')}}`);
        return;
      case el.matches('rt, rp'):
        el.remove();
        return;
    }
  });
  if (range.startOffset === 0 &&
      range.startContainer.parentElement?.matches('.cite, .quote') &&
      (!range.startContainer.previousSibling || range.startContainer.previousSibling.nodeName === 'BR')) {
    node.prepend(`>${range.startContainer.parentElement.matches('.quote.invalid') ? ' ' : ''}`);
  }
  else {
    node.prepend(`>>${anchor}\n> `);
    anchor = '';
  }
  duffEach(node.querySelectorAll('br'), el => {
    if (anchor && el.nextSibling instanceof Element && el.nextSibling.matches('.cite, .quote')) {
      el.replaceWith(`\n>${el.nextSibling.matches('.quote.invalid') ? ' ' : ''}`);
      return;
    }
    if (anchor && el.parentElement?.closest('.cite, .quote')) {
      el.replaceWith(`\n>${el.parentElement.closest('.quote.invalid') ? ' ' : ''}`);
      return;
    }
    if (anchor) {
      el.replaceWith(`\n>>${anchor}\n> `);
      anchor = '';
      return;
    }
    else {
      el.replaceWith(`\n> `);
      return;
    }
  });
  anchor && node.append(`\n>>${anchor}`);
  return node.textContent!;
}

function fit(range: Range): void {
  const node = range.startContainer;
  if (node.parentElement?.matches('.cite > .anchor')) {
    return void range.setStart(node.parentElement.previousSibling!, 0);
  }
  if (node.nodeName === 'BR' &&
      node.nextSibling instanceof Element && node.nextSibling.matches('.cite, .quote')) {
    return void range.setStart(node.nextSibling.firstChild!, 0);
  }
  const offset = range.startOffset;
  if (node.parentElement?.matches('.cite, .quote') &&
      node.textContent!.slice(0, offset) === '>'.repeat(offset) &&
      (!node.previousSibling || node.previousSibling.nodeName === 'BR')) {
    return void range.setStart(node, 0);
  }
}

function trim<T extends Node>(node: T): T {
  for (let child: ChildNode & Node | null; child = node.firstChild;) {
    if (child.textContent) break;
    child.remove();
  }
  return node;
}
