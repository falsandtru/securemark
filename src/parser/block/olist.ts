import { OListParser } from '../block';
import { combine, some } from '../../combinator';
import { block } from '../source/block';
import { firstline } from '../source/line';
import { match } from '../source/validation';
import { ulist } from './ulist';
import { indent, fillOListFlag } from './indent';
import { inline } from '../inline';
import { squash } from '../squash';
import { html } from 'typed-dom';

const syntax = /^([0-9]+|[A-Z]+|[a-z]+)(\.(?:\s|$)|(?=\n|$))/;

export const olist: OListParser = block(source => {
  const [whole = '', index = '', flag = ''] = source.match(syntax) || [];
  if (!whole || !flag) return;
  const el = html('ol', {
    'start': index,
    'type': Number.isFinite(+index) ? '1' : index === index.toLowerCase() ? 'a' : 'A',
  });
  while (true) {
    const line = firstline(source);
    if (line.trim() === '') break;
    if (!match(line, '', syntax)) return;
    const text = line.slice(line.split(/\s/, 1)[0].length + 1).trim();
    const li = el.appendChild(html('li'));
    void li.appendChild(squash((some(combine<OListParser>([inline]))(text) || [[]])[0], document.createDocumentFragment()));
    source = source.slice(line.length + 1);
    const [block = '', rest = undefined] = indent(source) || [];
    if (rest === undefined) continue;
    if (!li.firstChild) return;
    const [children = [], brest = block] = combine<OListParser>([ulist, olist])(fillOListFlag(block)) || [];
    if (children.length !== 1 || brest.length !== 0) return;
    void li.appendChild(squash(children, document.createDocumentFragment()));
    source = rest;
    continue;
  }
  assert(el.children.length > 0);
  return [[el], source];
});
