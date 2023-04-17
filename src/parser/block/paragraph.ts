import { ParagraphParser } from '../block';
import { union, some, block, convert, fmap } from '../../combinator';
import { inline } from '../inline';
import { visualize, trimNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const paragraph: ParagraphParser = block(fmap(
  convert(source => `\r${source}`,
  visualize(some(union([inline])))),
  ns => [html('p', trimNodeEnd(defrag(ns)))]));
