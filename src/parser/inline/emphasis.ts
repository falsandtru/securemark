import { EmphasisParser, inline } from '../inline';
import { union, some, validate, verify, surround, lazy, fmap } from '../../combinator';
import { strong } from './strong';
import { defrag, startsWithTightText } from '../util';
import { html } from 'typed-dom';

export const emphasis: EmphasisParser = lazy(() => verify(fmap(validate(
  /^\*\S[\s\S]*?\*/,
  surround('*', defrag(some(union([strong, some(inline, '*')]))), '*')),
  ns => [html('em', ns)]),
  ([el]) => startsWithTightText(el)));
