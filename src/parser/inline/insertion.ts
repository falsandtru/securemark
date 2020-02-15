import { InsertionParser, inline } from '../inline';
import { union, some, creator, backtracker, surround, lazy, fmap } from '../../combinator';
import { str } from '../source';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const insertion: InsertionParser = lazy(() => creator(fmap(surround(
  '++',
  some(union([inline]), '++'),
  backtracker(str('++'))),
  ns => [html('ins', defrag(ns))])));
