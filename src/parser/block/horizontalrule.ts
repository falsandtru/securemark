import { HorizontalRuleParser } from '../block';
import { verify } from './util/verification';

const syntax = /^\s*-\s*-\s*(?:-\s*)+(?:\n|$)/;

export const horizontalrule: HorizontalRuleParser = verify((source: string): [[HTMLHRElement], string] | undefined => {
  const [whole = ''] = source.split('\n', 1)[0].match(syntax) || [];
  if (!whole) return;
  return [[document.createElement('hr')], source.slice(whole.length + 1)];
});
