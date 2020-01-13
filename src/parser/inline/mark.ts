import { MarkParser, inline } from '../inline';
import { union, some, validate, surround, configure, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { html, text } from 'typed-dom';

export const mark: MarkParser = lazy(() => fmap(validate(
  /^==[\s\S]+?==/,
  configure({ syntax: { inline: { mark: false } } },
  surround('==', defrag(some(union([inline]), '==')), '=='))),
  (ns, config) =>
    config.syntax?.inline?.mark ?? true
      ? [html('mark', ns)]
      : [html('span', { class: 'invalid', 'data-invalid-syntax': 'mark', 'data-invalid-type': 'nesting' }, [text('=='), ...ns, text('==')])]));
