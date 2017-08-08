import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { HeadingParser, consumeBlockEndEmptyLine } from '../block';
import { InlineParser, inline } from '../inline';
import { IndexParser } from '../text';
import { index, idxhash } from '../text/index';
import { squash } from '../text';

type SubParsers = [IndexParser, InlineParser];

const syntax = /^(#{1,6})\s+?([^\n]+)/;

export const heading: HeadingParser = function (source: string): Result<HTMLHeadingElement, SubParsers> {
  if (!source.startsWith('#')) return;
  const [whole, { length: level }, title] = source.split('\n', 1).shift()!.match(syntax) || ['', '', ''];
  if (!whole) return;
  assert(level > 0 && level < 7);
  assert(title.length > 0);
  const [children] = loop(combine<SubParsers, HTMLElement | Text>([index, inline]))(title.trim()) || [[]];
  const el = document.createElement(<'h1'>`h${level}`);
  void el.appendChild(squash(children));
  const id = el.querySelector('.index') || <HTMLElement>el.cloneNode(true);
  void id.remove();
  void Array.from(id.querySelectorAll('code[data-src], .math[data-src]'))
    .forEach(el =>
      el.textContent = el.getAttribute('data-src'));
  void el.setAttribute('id', idxhash(id.textContent!));
  return consumeBlockEndEmptyLine<HTMLHeadingElement, SubParsers>([el], source.slice(whole.length + 1));
};
