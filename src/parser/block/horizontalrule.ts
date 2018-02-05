import { HorizontalRuleParser } from '../block';
import { verify } from './util/verification';

const syntax = /^(?:\s*-){3,}\s*$/;

export const horizontalrule: HorizontalRuleParser = verify(source => {
  const [whole = ''] = source.split('\n', 1)[0].match(syntax) || [];
  if (!whole) return;
  return [[document.createElement('hr')], source.slice(whole.length + 1)];
});
