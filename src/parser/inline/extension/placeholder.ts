import { ExtensionParser, inline } from '../../inline';
import { some } from '../../../combinator';
import { template } from './template';
import { html } from 'typed-dom';

export const placeholder: ExtensionParser.PlaceholderParser = template('', (_, flag) => {
  const el = html('span', some(inline)(`**WARNING: DON'T USE \`[${flag} ]\` SYNTAX!!** This syntax is reserved for extensibility.`)![0]);
  return [[el], ''];
});
