import { HorizontalRuleParser } from '../block';
import { union, surround, transform } from '../../combinator';
import { block } from '../source/block';
import { contentline } from '../source/line';
import { html } from 'typed-dom';

const syntax = /^(?=-{3,}[^\S\n]*(?:\n|$))/;

export const horizontalrule: HorizontalRuleParser = block(transform(
  surround(syntax, union<HorizontalRuleParser>([contentline]), ''),
  (_, rest) =>
    [[html('hr')], rest]));
