import { InsertionParser, inline } from '../inline';
import { union, some, validate, surround, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const insertion: InsertionParser = lazy(() => fmap(validate(
  /^\+\+[\s\S]+?\+\+/,
  union<InsertionParser>([
    surround('++', defrag(some(union([insertion, some(inline, '++')]))), '++'),
    surround('++', defrag(some(some(inline, '++'))), '++'),
  ])),
  ns => [html('ins', ns)]));
