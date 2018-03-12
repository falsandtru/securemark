import { NewlineParser } from '../block';
import { combine, some } from '../../combinator';
import { emptyline } from '../source/line';

export const newline: NewlineParser = some(combine<NewlineParser>([emptyline]));
