import { HorizontalRuleParser } from '../block';
import { verify } from './util/verification';
import { html } from 'typed-dom';

const syntax = /^(?:\s*-){3,}\s*$/;

export const horizontalrule: HorizontalRuleParser = verify(source => {
  const [whole = ''] = source.split('\n', 1)[0].match(syntax) || [];
  if (!whole) return;
  return [[html('hr')], source.slice(whole.length + 1)];
});
