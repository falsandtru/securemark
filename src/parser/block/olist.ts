import { OListParser } from '../block';
import { verifyBlockEnd } from './end';
import { combine, loop } from '../../combinator';
import { ulist } from './ulist';
import { indent, fillOListFlag } from './indent';
import { inline } from '../inline';
import { squash } from '../squash';

const syntax = /^([0-9]+|[A-Z]+|[a-z]+)(\.(?:\s|$)|(?=\n|$))/;

export const olist: OListParser = verifyBlockEnd((source: string): [[HTMLOListElement], string] | undefined => {
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
      void li.appendChild(squash((loop(combine<HTMLElement | Text, OListParser.InnerParsers>([inline]))(text) || [[]])[0]));
      source = source.slice(line.length + 1);
      continue;
    }
    else {
      const li = el.lastElementChild!;
      if (!li.firstChild || [HTMLUListElement, HTMLOListElement].some(E => li.lastElementChild instanceof E)) return;
      const [block, rest = undefined] = indent(source) || [''];
      if (rest === undefined) return;
      const [children, brest = block] = combine<HTMLElement | Text, OListParser.InnerParsers>([ulist, olist])(fillOListFlag(block)) || [[]];
      if (children.length !== 1 || brest.length !== 0) return;
      void li.appendChild(squash(children));
      source = rest;
      continue;
    }
  }
  assert(el.children.length > 0);
  return [[el], source];
});
