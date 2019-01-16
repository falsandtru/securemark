import { TemplateParser } from '../inline';
import { union, some, subline, rewrite, surround, lazy } from '../../combinator';
import { escsource } from '../source/escapable';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const template: TemplateParser = lazy(() => subline(rewrite(
  surround('{{', defrag(some(union([escsource]), /^\n|^}}/)), '}}', false),
  source => [[html('span', { class: 'template' }, source)], ''])));
