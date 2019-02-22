import { TemplateParser } from '../inline';
import { union, tails, some, subline, focus, rewrite, surround, lazy } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { escsource } from '../source/escapable';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const template: TemplateParser = lazy(() => subline(tails([
  focus(/^!/, unescsource),
  rewrite(
    surround('{{', defrag(some(union([escsource]), /^\n|^}}/)), '}}', false),
    source => [[html('span', { class: 'template' }, source)], '']),
])));
