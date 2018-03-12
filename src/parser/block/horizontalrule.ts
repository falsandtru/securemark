import { HorizontalRuleParser } from '../block';
import { combine, surround, transform } from '../../combinator';
import { verify } from './util/verification';
import { line, visibleline } from '../source/line';
import { html } from 'typed-dom';

const syntax = /^(?=-{3,}[^\S\n]*(?:\n|$))/;

export const horizontalrule: HorizontalRuleParser = verify(line(
  transform(
    surround(syntax, combine<HorizontalRuleParser>([visibleline]), ''),
    (_, rest) =>
      [[html('hr')], rest])));
