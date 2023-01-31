import { ParagraphParser } from '../block';
import { union, some, block, trimEnd, fmap } from '../../combinator';
import { inline } from '../inline';
import { visualize } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const paragraph: ParagraphParser = block(fmap(
  visualize(trimEnd(some(union([inline])))),
  ns => [html('p', defrag(ns))]));
