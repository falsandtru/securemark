import { TemplateParser, inline } from '../inline';
import { some, rewrite, creator, surround, lazy } from '../../combinator';
import { html } from 'typed-dom';

export const template: TemplateParser = lazy(() => creator(rewrite(
  surround('{{', some(inline, '}'), '}}', true),
  source => [[html('span', { class: 'template' }, source)], ''])));
