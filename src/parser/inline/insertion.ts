import { InsertionParser, inline } from '../inline';
import { union, some, validate, verify, surround, lazy, fmap } from '../../combinator';
import { defrag, hasInsOrDel } from '../util';
import { html } from 'typed-dom';

export const insertion: InsertionParser = lazy(() => verify(fmap(validate(
  /^\+\+[\s\S]+?\+\+/,
  surround('++', defrag(some(some(union([inline]), '++'))), '++')),
  ns => [html('ins', ns)]),
  ([el]) => !hasInsOrDel(el)));
