import { EmphasisParser, inline } from '../inline';
import { union, some, validate, verify, surround, check, configure, lazy, fmap } from '../../combinator';
import { strong } from './strong';
import { defrag, trimNodeEnd, hasTightText } from '../util';
import { html } from 'typed-dom';

export const emphasis: EmphasisParser = lazy(() => verify(fmap(trimNodeEnd(validate(
  /^\*\S[\s\S]*?\*/,
  check(config => config?.syntax?.inline?.emphasis ?? true,
  configure({ syntax: { inline: { emphasis: false } } },
  surround('*', defrag(some(union([strong, some(inline, '*')]))), '*'))))),
  ns => [html('em', ns)]),
  ([el]) => hasTightText(el)));
