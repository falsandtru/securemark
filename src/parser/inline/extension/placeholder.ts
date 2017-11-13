import { ExtensionParser, inline } from '../../inline';
import { loop } from '../../../combinator';
import { squash } from '../../squash';
import { template } from './template';

export const placeholder: ExtensionParser.PlaceholderParser = template((flag): [[HTMLSpanElement], string] | undefined => {
  const el = document.createElement('span');
  void el.appendChild(squash(loop(inline)(`++**WARNING: DON'T USE \`[${flag} ]\` SYNTAX!!** This syntax is reserved for extensibility.++`)![0]));
  return [[el], ''];
});
