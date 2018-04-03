import { HorizontalRuleParser } from '../block';
import { match } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { html } from 'typed-dom';

const syntax = /^-{3,}[^\S\n]*(?:\n|$)/;

export const horizontalrule: HorizontalRuleParser = block(line(
  match(syntax, (_, r) => [[html('hr')], r])));
