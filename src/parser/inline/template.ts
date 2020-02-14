import { TemplateParser, inline } from '../inline';
import { some, rewrite, creation, backtrack, surround, lazy } from '../../combinator';
import { str } from '../source';
import { html} from 'typed-dom';

export const template: TemplateParser = lazy(() => creation(rewrite(
  surround('{{', some(inline, '}}'), backtrack(str('}}')), false),
  source => [[html('span', { class: 'template' }, source)], ''])));
