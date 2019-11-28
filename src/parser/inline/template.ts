import { TemplateParser, inline } from '../inline';
import { tails, some, subline, rewrite, surround, lazy, fmap } from '../../combinator';
import { char } from '../source';
import { html, text } from 'typed-dom';

export const template: TemplateParser = lazy(() => subline(fmap(
  tails([
    char('!'),
    rewrite(
      surround('{{', some(inline, /^\\?\n|^}}/), '}}', false),
      source => [[text(source)], '']),
  ]),
  ns => [html('span', { class: 'template' }, [ns.pop()!]), ...ns].reverse())));
