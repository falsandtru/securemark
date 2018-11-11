import { StrongParser, inline } from '../inline';
import { union, some, fmap, surround, verify, lazy } from '../../combinator';
import { compress, startsWithTightText } from '../util';
import { html } from 'typed-dom';

export const strong: StrongParser = verify(
  fmap(lazy(() =>
    surround(/^\*\*(?=\S[\s\S]*?\*\*)/, compress(some(union([inline]), '**')), '**')),
    ns => [html('strong', ns)]),
  ([el]) => startsWithTightText(el));
