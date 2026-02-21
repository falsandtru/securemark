import { ParagraphParser } from '../block';
import { union, some, block, fmap } from '../../combinator';
import { inline } from '../inline';
import { visualize, trimBlankEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const paragraph: ParagraphParser = block(fmap(
  visualize(trimBlankEnd(some(union([inline])))),
  ns => [html('p', defrag(ns))]));
