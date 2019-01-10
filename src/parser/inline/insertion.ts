﻿import { InsertionParser, inline } from '../inline';
import { union, some, focus, validate, surround, lazy, fmap } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const insertion: InsertionParser = lazy(() => union([
  fmap(validate(
    /^\+\+(?!\+)[\s\S]+?\+\+/,
    surround('++', defrag(some(inline, '++')), '++')),
    ns => [html('ins', ns)]),
  focus(/^\+{3,}/, defrag(some(unescsource))),
]));
