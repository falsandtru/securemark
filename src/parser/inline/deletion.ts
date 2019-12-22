import { DeletionParser, inline } from '../inline';
import { union, some, validate, surround, configure, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { html, text } from 'typed-dom';

export const deletion: DeletionParser = lazy(() => fmap(validate(
  /^~~[\s\S]+?~~/,
  configure({ syntax: { inline: { insertion: false, deletion: false } } },
  surround('~~', defrag(some(union([inline]), '~~')), '~~'))),
  (ns, config) =>
    config.syntax?.inline?.deletion ?? true
      ? [html('del', ns)]
      : [html('span', { class: 'invalid', 'data-invalid-syntax': 'deletion', 'data-invalid-type': 'nesting' }, [text('~~'), ...ns, text('~~')])]));
