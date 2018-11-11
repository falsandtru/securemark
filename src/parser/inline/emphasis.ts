import { EmphasisParser, inline } from '../inline';
import { union, some, fmap, surround, verify, lazy } from '../../combinator';
import { strong } from './strong';
import { compress, startsWithTightText } from '../util';
import { html } from 'typed-dom';

export const emphasis: EmphasisParser = verify(
  fmap(lazy(() =>
    surround(/^\*(?=\S[\s\S]*?\*)/, compress(some(union([strong, some(inline, '*')]))), '*')),
    ns => [html('em', ns)]),
  ([el]) => startsWithTightText(el));
