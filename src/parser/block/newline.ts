import { NewlineParser } from '../block';
import { union, some } from '../../combinator';
import { blankline } from '../source/line';

export const newline: NewlineParser = some(union([blankline]));
