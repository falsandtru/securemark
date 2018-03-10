import { HorizontalRuleParser } from '../block';
import { surround, transform } from '../../combinator';
import { verify } from './util/verification';
import { line, nonemptyline } from '../source/line';
import { html } from 'typed-dom';

const syntax = /^(?=-{3,}[^\S\n]*(?:\n|$))/;

export const horizontalrule: HorizontalRuleParser = verify(line(
  transform(
    surround(syntax, nonemptyline, ''),
    (_, rest) =>
      [[html('hr')], rest])));
