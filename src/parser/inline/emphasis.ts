import { EmphasisParser, inline } from '../inline';
import { union, some, validate, verify, surround, configure, lazy, fmap } from '../../combinator';
import { strong } from './strong';
import { defrag, trimNodeEnd, hasTightText } from '../util';
import { html, text } from 'typed-dom';

export const emphasis: EmphasisParser = lazy(() => verify(fmap(validate(
  /^\*\S[\s\S]*?\*/,
  configure({ syntax: { inline: { emphasis: false } } },
  surround('*', trimNodeEnd(defrag(some(union([strong, some(inline, '*')])))), '*'))),
  (ns, config) =>
    config.syntax?.inline?.emphasis ?? true
      ? [html('em', ns)]
      : [html('span', { class: 'invalid', 'data-invalid-syntax': 'emphasis', 'data-invalid-type': 'nesting' }, [text('*'), ...ns, text('*')])]),
  ([el]) => hasTightText(el)));
