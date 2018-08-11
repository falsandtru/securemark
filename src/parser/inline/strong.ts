import { StrongParser, inline } from '../inline';
import { union, some, fmap, surround, verify, build } from '../../combinator';
import { compress, hasText } from '../util';
import { html } from 'typed-dom';

export const strong: StrongParser = verify(fmap(build(() =>
  surround('**', compress(some(union([inline]), '**')), '**')),
  ns => [html('strong', ns)]
), ([el]) => hasText(el));
