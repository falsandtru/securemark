import { ParagraphParser } from '../block';
import { union, some, block, trim, fmap } from '../../combinator';
import { inline } from '../inline';
import { localize } from '../locale';
import { visualize } from '../util';
import { html, defrag } from 'typed-dom';

export const paragraph: ParagraphParser = block(localize(fmap(
  trim(visualize(some(union([inline])))),
  ns => [html('p', defrag(ns))])));
