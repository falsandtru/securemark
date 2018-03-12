import { NewlineParser } from '../block';
import { combine, some } from '../../combinator';
import { invisibleline } from '../source/line';

export const newline: NewlineParser = some(combine<NewlineParser>([invisibleline]));
