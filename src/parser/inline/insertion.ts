import { InsertionParser, inline } from '../inline';
import { union, some, creation, backtrack, surround, lazy, fmap } from '../../combinator';
import { str } from '../source';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const insertion: InsertionParser = lazy(() => creation(fmap(surround(
  '++',
  some(union([inline]), '++'),
  backtrack(str('++'))),
  ns => [html('ins', defrag(ns))])));
