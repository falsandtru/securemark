import { ParagraphParser } from '../block';
import { union, some, block, convert, trimEnd, fmap } from '../../combinator';
import { inline } from '../inline';
import { visualize } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const paragraph: ParagraphParser = block(fmap(
  convert(source => `\r${source}`,
  visualize(trimEnd(some(union([inline]))))),
  ns => [html('p', defrag(ns))]));
