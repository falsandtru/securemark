import { HorizontalRuleParser } from '../block';
import { verifyBlockEnd } from './end';

const syntax = /^\s*-\s*-\s*(?:-\s*)+(?:\n|$)/;

export const horizontalrule: HorizontalRuleParser = verifyBlockEnd((source: string): [[HTMLHRElement], string] | undefined => {
  const [whole] = source.split('\n', 1)[0].match(syntax) || [''];
  if (!whole) return;
  return [[document.createElement('hr')], source.slice(whole.length + 1)];
});
