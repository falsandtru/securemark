import { ParagraphParser } from '../block';
import { union, some, block, fmap } from '../../combinator';
import { inline } from '../inline';
import { lineable } from '../util';
import { visualize, trimNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const paragraph: ParagraphParser = block(fmap(
  visualize(lineable(some(union([inline])))),
  ns => [html('p', trimNodeEnd(defrag(ns)))]));
