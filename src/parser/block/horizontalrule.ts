import { Result } from '../../parser';
import { HorizontalRuleParser, consumeBlockEndEmptyLine } from '../block';

const syntax = /^\s*-\s*-\s*(?:-\s*)+(?:\n|$)/;

export const horizontalrule: HorizontalRuleParser = function (source: string): Result<HTMLHRElement, never> {
  const [whole] = source.split('\n', 1)[0].match(syntax) || [''];
  if (!whole) return;
  return consumeBlockEndEmptyLine<HTMLHRElement, never>([document.createElement('hr')], source.slice(whole.length + 1));
};
