import { input, exec } from '../combinator/data/parser';
import { cite } from '../parser/block/reply/cite';

export function quote(anchor: string, range: Range): string {
  if (exec(cite(input(`>>${anchor}`, {}))) !== '') throw new Error(`Invalid anchor: ${anchor}`);
  fit(range);
  const node = trim(range.cloneContents());
  if (!node.firstChild) return '';
  for (let es = node.querySelectorAll('code[data-src], .math[data-src], .media[data-src], rt, rp'),
           len = es.length, i = 0; i < len; ++i) {
    const el = es[i];
    switch (true) {
      case el.matches('code'):
      case el.matches('.math'):
        el.replaceWith(el.getAttribute('data-src')!);
        continue;
      case el.matches('.url'):
        el.replaceWith(
          /[\s{}]/.test(el.getAttribute('href')!)
            ? `{ ${el.getAttribute('href')} }`
            : `{${el.getAttribute('href')}}`);
        continue;
      case el.matches('.media'):
        el.replaceWith(
          /[\s{}]/.test(el.getAttribute('data-src')!)
            ? `!{ ${el.getAttribute('data-src')} }`
            : `!{${el.getAttribute('data-src')}}`);
        continue;
      case el.matches('rt, rp'):
        el.remove();
        continue;
    }
  }
  if (range.startOffset === 0 &&
      range.startContainer.parentElement?.matches('.cite, .quote') &&
      (!range.startContainer.previousSibling || range.startContainer.previousSibling.nodeName === 'BR')) {
    node.prepend(`>${range.startContainer.parentElement.matches('.quote.invalid') ? ' ' : ''}`);
  }
  else {
    node.prepend(`>>${anchor}\n> `);
    anchor = '';
  }
  for (let es = node.querySelectorAll('br'),
           len = es.length, i = 0; i < len; ++i) {
    const el = es[i];
    if (anchor && el.nextSibling instanceof Element && el.nextSibling.matches('.cite, .quote')) {
      el.replaceWith(`\n>${el.nextSibling.matches('.quote.invalid') ? ' ' : ''}`);
      continue;
    }
    if (anchor && el.parentElement?.closest('.cite, .quote')) {
      el.replaceWith(`\n>${el.parentElement.closest('.quote.invalid') ? ' ' : ''}`);
      continue;
    }
    if (anchor) {
      el.replaceWith(`\n>>${anchor}\n> `);
      anchor = '';
      continue;
    }
    else {
      el.replaceWith(`\n> `);
      continue;
    }
  }
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

function trim<N extends Node>(node: N): N {
  for (let child: ChildNode & Node | null; child = node.firstChild;) {
    if (child.textContent) break;
    child.remove();
  }
  return node;
}
