import { Result } from '../../parser.d';
import { HorizontalRuleParser, consumeBlockEndEmptyLine } from '../block';

const syntax = /^[ \t]*-[ \t]*-[ \t]*(?:-[ \t]*)+(?:\n|$)/;

export const horizontalrule: HorizontalRuleParser = function (source: string): Result<HTMLHRElement, never> {
  const [whole] = source.match(syntax) || [''];
  if (!whole) return;
  return consumeBlockEndEmptyLine<HTMLHRElement, never>([document.createElement('hr')], source.slice(whole.length));
}
