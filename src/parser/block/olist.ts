import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { UListParser, OListParser } from '../block';
import { verifyBlockEnd } from './end';
import { ulist } from './ulist';
import { indent, fillOListFlag } from './indent';
import { InlineParser, inline } from '../inline';
import { squash } from '../squash';

type SubParsers = [InlineParser] | [UListParser, OListParser];

const syntax = /^([0-9]+|[A-Z]+|[a-z]+)(\.(?:\s|$)|(?=\n|$))/;

export const olist: OListParser = verifyBlockEnd(function (source: string): Result<HTMLOListElement, SubParsers> {
  const [whole, index, flag] = source.match(syntax) || ['', '', ''];
  if (!whole || !flag) return;
  const el = document.createElement('ol');
  void el.setAttribute('start', index);
  void el.setAttribute('type', Number.isFinite(+index) ? '1' : index === index.toLowerCase() ? 'a' : 'A');
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '') break;
    if (line.search(syntax) === 0) {
      const text = line.slice(line.split(/\s/, 1)[0].length + 1).trim();
      const li = el.appendChild(document.createElement('li'));
      void li.appendChild(squash((loop(combine<SubParsers, HTMLElement | Text>([inline]))(text) || [[]])[0]));
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
  return [[el], source];
});
