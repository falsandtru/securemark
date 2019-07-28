import { NewlineParser } from '../source';
import { union, focus, fmap } from '../../combinator';
import { text } from './text';

export const newline: NewlineParser = fmap(
  focus('\n', union([text])),
  ns => ns as [HTMLBRElement]);
