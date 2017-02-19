import { Result } from '../../../parser';
import { ExtensionParser, consumeBlockEndEmptyLine } from '../../block';
import { loop } from '../../../combinator/loop';
import { InlineParser, inline } from '../../inline';
import { squash } from '../../inline/text';

type SubParsers = [InlineParser];

export const placeholder: ExtensionParser.PlaceholderParser = function (_: string): Result<HTMLElement, SubParsers> {
  const el = document.createElement('p');
  void el.appendChild(squash(loop(inline)("**DON'T USE `~~~` SYNTAX!!**\\\nThis extension syntax is reserved for extensibility.")![0]));
  return consumeBlockEndEmptyLine<HTMLElement, SubParsers>([el], '');
}
