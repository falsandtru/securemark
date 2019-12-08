import { NewlineParser } from '../block';
import { union, some } from '../../combinator';
import { emptyline } from '../source';

export const newline: NewlineParser = some(union([emptyline]));
