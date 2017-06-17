import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { UListParser, OListParser, consumeBlockEndEmptyLine } from '../block';
import { olist } from './olist';
import { indent, fillOListFlag } from './indent';
import { InlineParser, inline } from '../inline';
import { squash } from '../text';

type SubParsers = [InlineParser] | [UListParser, OListParser];

const syntax = /^([-+*])(?=\s|$)/;
const content = /^(\[[ x]\](?: +|$))?.*$/;

export const ulist: UListParser = function (source: string): Result<HTMLUListElement, SubParsers> {
  const [whole, flag] = source.match(syntax) || ['', ''];
  if (!whole) return;
  const el = document.createElement('ul');
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '') break;
    if (line.search(syntax) === 0) {
      if (!line.startsWith(flag)) return;
      const [text, checkbox = ''] = line.slice(line.split(' ', 1)[0].length + 1).trim().match(content)!;
      assert(checkbox === '' || checkbox.slice(0, 3) === '[ ]' || checkbox.slice(0, 3) === '[x]');
      assert(checkbox.slice(3).trim() === '');
      const li = el.appendChild(document.createElement('li'));
      if (checkbox) {
        const cb = document.createElement('span');
        void cb.setAttribute('class', 'checkbox');
        void cb.appendChild(document.createTextNode(`${checkbox.trim()} `));
        void li.appendChild(cb);
      }
      void li.appendChild(squash((loop(combine<SubParsers, HTMLElement | Text>([inline]))(text.slice(checkbox.length)) || [[]])[0]));
      source = source.slice(line.length + 1);
      continue;
    }
    else {
      const li = el.lastElementChild!;
      if (!li.firstChild || [HTMLUListElement, HTMLOListElement].some(E => li.lastElementChild instanceof E)) return;
      const [block, rest] = indent(source);
      if (rest === source) return;
      const [children, brest] = combine<SubParsers, HTMLElement | Text>([ulist, olist])(fillOListFlag(block)) || [[], block];
      if (children.length !== 1 || brest.length !== 0) return;
      void li.appendChild(squash(children));
      source = rest;
      continue;
    }
  }
  assert(el.children.length > 0);
  return consumeBlockEndEmptyLine<HTMLUListElement, SubParsers>([el], source);
};
