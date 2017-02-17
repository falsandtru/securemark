import { Result } from '../../parser.d';
import { HorizontalRuleParser, consumeBlockEndEmptyLine } from '../block';

const syntax = /^\s*-\s*-\s*(?:-\s*)+$/;

export const horizontalrule: HorizontalRuleParser = function (source: string): Result<HTMLHRElement, never> {
  const [whole] = source.match(syntax) || [''];
  if (!whole) return;
  return consumeBlockEndEmptyLine<HTMLHRElement, never>([document.createElement('hr')], source.slice(whole.length + 1));
}
