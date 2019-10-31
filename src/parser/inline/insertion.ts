import { InsertionParser, inline } from '../inline';
import { union, some, validate, surround, check, configure, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const insertion: InsertionParser = lazy(() => fmap(validate(
  /^\+\+[\s\S]+?\+\+/,
  check(config => config?.syntax?.inline?.insertion ?? true,
  configure({ syntax: { inline: { insertion: false, deletion: false } } },
  surround('++', defrag(some(union([inline]), '++')), '++')))),
  ns => [html('ins', ns)]));
