import { InsertionParser, inline } from '../inline';
import { union, some, validate, surround, configure, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { html, text } from 'typed-dom';

export const insertion: InsertionParser = lazy(() => fmap(validate(
  /^\+\+[\s\S]+?\+\+/,
  configure({ syntax: { inline: { insertion: false, deletion: false } } },
  surround('++', defrag(some(union([inline]), '++')), '++'))),
  (ns, config) =>
    config.syntax?.inline?.insertion ?? true
      ? [html('ins', ns)]
      : [html('span', { class: 'invalid', 'data-invalid-syntax': 'insertion', 'data-invalid-message': 'Cannot nest this syntax' }, [text('++'), ...ns, text('++')])]));
