import { EmphasisParser, inline } from '../inline';
import { union, some, fmap, surround, contract, lazy } from '../../combinator';
import { strong } from './strong';
import { defrag, startsWithTightText } from '../util';
import { html } from 'typed-dom';

export const emphasis: EmphasisParser = contract(
  /^\*\S[\s\S]*?\*/,
  fmap(lazy(() =>
    surround('*', defrag(some(union([strong, some(inline, '*')]))), '*')),
    ns => [html('em', ns)]),
  ([el]) => startsWithTightText(el));
