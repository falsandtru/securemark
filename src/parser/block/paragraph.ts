import { ParagraphParser } from '../block';
import { union, some, block, fmap } from '../../combinator';
import { inline } from '../inline';
import { linearize } from '../util';
import { visualize, trimBlankEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const paragraph: ParagraphParser = block(fmap(
  visualize(trimBlankEnd(linearize(some(union([inline]))))),
  ns => [html('p', defrag(ns))]));
