import { TemplateParser, inline } from '../inline';
import { some, rewrite, creator, backtracker, surround, lazy } from '../../combinator';
import { str } from '../source';
import { html } from 'typed-dom';

export const template: TemplateParser = lazy(() => creator(rewrite(
  surround('{{', some(inline, '}}'), backtracker(str('}}')), true),
  source => [[html('span', { class: 'template' }, source)], ''])));
