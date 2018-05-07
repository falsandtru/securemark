import { HorizontalRuleParser } from '../block';
import { match } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { html } from 'typed-dom';

export const horizontalrule: HorizontalRuleParser = block(line(
  match(
    /^-{3,}[^\S\n]*(?:\n|$)/,
    (_, r) => [[html('hr')], r])));
