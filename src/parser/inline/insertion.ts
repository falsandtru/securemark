import { InsertionParser, inline } from '../inline';
import { union, some, validate, surround, lazy, override, fmap } from '../../combinator';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const insertion: InsertionParser = lazy(() => fmap(validate(
  /^\+\+[\s\S]+?\+\+/,
  validate(config => config?.syntax?.inline?.insertion ?? true,
  override({ syntax: { inline: { insertion: false, deletion: false } } },
  surround('++', defrag(some(union([inline]), '++')), '++')))),
  ns => [html('ins', ns)]));
