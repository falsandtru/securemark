import { LinebreakParser } from '../source';
import { union, focus, fmap } from '../../combinator';
import { text } from './text';

export const linebreak: LinebreakParser = fmap(
  focus('\n', union([text])),
  ns => ns as [HTMLBRElement]);
