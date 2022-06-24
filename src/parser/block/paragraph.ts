import { ParagraphParser } from '../block';
import { union, some, block, trimEnd, fmap } from '../../combinator';
import { inline } from '../inline';
import { localize } from '../locale';
import { visualize } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const paragraph: ParagraphParser = block(localize(fmap(
  visualize(trimEnd(some(union([inline])))),
  ns => [html('p', defrag(ns))])));
