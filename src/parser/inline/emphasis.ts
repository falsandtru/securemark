import { EmphasisParser, inline } from '../inline';
import { union, some, surround, verify, fmap, build } from '../../combinator';
import { strong } from './strong';
import { compress, hasText } from '../util';
import { html } from 'typed-dom';

export const emphasis: EmphasisParser = verify(fmap(build(() =>
  surround('*', compress(some(union([strong, some(inline, '*')]))), '*')),
  ns => [html('em', ns)]
), ([el]) => hasText(el));
