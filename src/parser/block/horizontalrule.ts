import { HorizontalRuleParser } from '../block';
import { match, block, line } from '../../combinator';
import { html } from 'typed-dom';

export const horizontalrule: HorizontalRuleParser = block(line(
  match(
    /^-{3,}[^\S\n]*(?:\n|$)/,
    (_, r) => [[html('hr')], r])));
