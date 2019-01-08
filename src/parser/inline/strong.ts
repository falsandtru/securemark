import { StrongParser, inline } from '../inline';
import { union, some, validate, verify, surround, lazy, fmap } from '../../combinator';
import { defrag, trimEnd, hasTightText } from '../util';
import { html } from 'typed-dom';

export const strong: StrongParser = lazy(() => verify(fmap(trimEnd(validate(
  /^\*\*\S[\s\S]*?\*\*/,
  surround('**', defrag(some(union([inline]), '**')), '**'))),
  ns => [html('strong', ns)]),
  ([el]) => hasTightText(el)));
