import { UListParser } from '../block';
import { verify } from './util/verification';
import { combine, loop } from '../../combinator';
import { olist } from './olist';
import { indent, fillOListFlag } from './util/indent';
import { inline } from '../inline';
import { squash } from '../squash';
import { html } from 'typed-dom';

const syntax = /^([-+*])(?=\s|$)/;
const content = /^(\[[ x]\](?: +|$))?.*$/;

export const ulist: UListParser = verify(source => {
  const [whole = '', flag = ''] = source.match(syntax) || [];
  if (!whole) return;
  const el = html('ul');
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '') break;
    if (line.search(syntax) === 0) {
      if (!line.startsWith(flag)) return;
      const [text, checkbox = ''] = line.slice(line.split(/\s/, 1)[0].length + 1).trim().match(content)!;
      assert(checkbox === '' || checkbox.slice(0, 3) === '[ ]' || checkbox.slice(0, 3) === '[x]');
      assert(checkbox.slice(3).trim() === '');
      const li = el.appendChild(html('li'));
      if (checkbox) {
        void li.appendChild(html('span', { class: 'checkbox' }, `${checkbox.trim()} `));
      }
      void li.appendChild(squash((loop(combine<HTMLElement | Text, UListParser.InnerParsers>([inline]))(text.slice(checkbox.length)) || [[]])[0]));
      source = source.slice(line.length + 1);
      continue;
    }
    else {
      const li = el.lastElementChild!;
      if (!li.firstChild || [HTMLUListElement, HTMLOListElement].some(E => li.lastElementChild instanceof E)) return;
      const [block = '', rest = undefined] = indent(source) || [];
      if (rest === undefined) return;
      const [children = [], brest = block] = combine<HTMLElement | Text, UListParser.InnerParsers>([ulist, olist])(fillOListFlag(block)) || [];
      if (children.length !== 1 || brest.length !== 0) return;
      void li.appendChild(squash(children));
      source = rest;
      continue;
    }
  }
  assert(el.children.length > 0);
  return [[el], source];
});
