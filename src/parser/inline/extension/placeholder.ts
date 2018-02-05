import { ExtensionParser, inline } from '../../inline';
import { loop } from '../../../combinator';
import { template } from './template';
import { html } from 'typed-dom';

export const placeholder: ExtensionParser.PlaceholderParser = template((flag): [[HTMLSpanElement], string] | undefined => {
  const el = html('span', loop(inline)(`++**WARNING: DON'T USE \`[${flag} ]\` SYNTAX!!** This syntax is reserved for extensibility.++`)![0]);
  return [[el], ''];
});
