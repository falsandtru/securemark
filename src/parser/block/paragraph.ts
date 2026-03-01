import { ParagraphParser } from '../block';
import { List, Data } from '../../combinator/data/parser';
import { union, some, block, fmap } from '../../combinator';
import { inline } from '../inline';
import { visualize, trimBlankEnd } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const paragraph: ParagraphParser = block(fmap(
  visualize(trimBlankEnd(some(union([inline])))),
  ns => new List([new Data(html('p', defrag(unwrap(ns))))])));
