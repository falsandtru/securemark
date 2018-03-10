import { NewlineParser } from '../block';
import { combine, some } from '../../combinator';
import { emptyline, fakeemptyline } from '../source/line';

export const newline: NewlineParser = some(combine<NewlineParser>([emptyline, fakeemptyline]));
