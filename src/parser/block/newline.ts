import { NewlineParser } from '../block';
import { union, some } from '../../combinator';
import { emptyline } from '../source/line';

export const newline: NewlineParser = some(union<NewlineParser>([emptyline]));
