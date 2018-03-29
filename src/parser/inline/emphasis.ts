import { EmphasisParser, inline } from '../inline';
import { combine, some, surround, transform, build } from '../../combinator';
import { strong } from './strong';
import { compress, hasText } from '../util';
import { html } from 'typed-dom';

export const emphasis: EmphasisParser = transform(build(() =>
  surround('*', compress(some(combine<EmphasisParser>([strong, some(inline, '*')]))), '*')),
  (ns, rest) => {
    const el = html('em', ns);
    return hasText(el)
      ? [[el], rest]
      : undefined;
  });
