import { Result } from '../../../combinator/parser';
import { loop } from '../../../combinator/loop';
import { ExtensionParser, inline } from '../../inline';
import { TextParser } from '../../source';
import { squash } from '../../squash';
import { template } from './template';

export const placeholder: ExtensionParser.PlaceholderParser = template(function (flag): Result<HTMLSpanElement, [TextParser]> {
  const el = document.createElement('span');
  void el.appendChild(squash(loop(inline)(`++**WARNING: DON'T USE \`[${flag} ]\` SYNTAX!!** This syntax is reserved for extensibility.++`)![0]));
  return [[el], ''];
});
