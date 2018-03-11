import { UListParser } from '../block';
import { verify } from './util/verification';
import { combine, some } from '../../combinator';
import { block } from '../source/block';
import { firstline } from '../source/line';
import { match } from '../source/validation';
import { olist } from './olist';
import { indent, fillOListFlag } from './util/indent';
import { inline } from '../inline';
import { squash } from '../squash';
import { html } from 'typed-dom';

const syntax = /^([-+*])(?=\s|$)/;
const content = /^(\[[ x]\](?: +|$))?.*$/;

export const ulist: UListParser = verify(block(source => {
  const [whole = '', flag = ''] = source.match(syntax) || [];
  if (!whole) return;
  const el = html('ul');
  while (true) {
    const line = firstline(source);
    if (line.trim() === '') break;
    if (!match(line, flag, syntax)) return;
    const [text, checkbox = ''] = line.slice(line.split(/\s/, 1)[0].length + 1).trim().match(content)!;
    assert(checkbox === '' || checkbox.slice(0, 3) === '[ ]' || checkbox.slice(0, 3) === '[x]');
    assert(checkbox.slice(3).trim() === '');
    const li = el.appendChild(html('li'));
    if (checkbox) {
      void li.appendChild(html('span', { class: 'checkbox' }, `${checkbox.trim()} `));
    }
    void li.appendChild(squash((some(combine<UListParser>([inline]))(text.slice(checkbox.length)) || [[]])[0], document.createDocumentFragment()));
    source = source.slice(line.length + 1);
    const [block = '', rest = undefined] = indent(source) || [];
    if (rest === undefined) continue;
    if (!li.firstChild) return;
    const [children = [], brest = block] = combine<UListParser>([ulist, olist])(fillOListFlag(block)) || [];
    if (children.length !== 1 || brest.length !== 0) return;
    void li.appendChild(squash(children, document.createDocumentFragment()));
    source = rest;
    continue;
  }
  assert(el.children.length > 0);
  return [[el], source];
}));
