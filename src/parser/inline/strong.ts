import { StrongParser, inline } from '../inline';
import { union, some, fmap, surround, contract, lazy } from '../../combinator';
import { defrag, startsWithTightText } from '../util';
import { html } from 'typed-dom';

export const strong: StrongParser = contract(
  /^\*\*\S[\s\S]*?\*\*/,
  fmap(lazy(() =>
    surround('**', defrag(some(union([inline]), '**')), '**')),
    ns => [html('strong', ns)]),
  ([el]) => startsWithTightText(el));
