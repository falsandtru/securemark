import { ExtensionParser, inline } from '../../inline';
import { union, some, match, surround, transform, build } from '../../../combinator';
import { line } from '../../source/line';
import { html } from 'typed-dom';

export const placeholder: ExtensionParser.PlaceholderParser = line(transform(build(() =>
  surround(
    '[',
    match(/^[~^\[]/, ([flag], rest) =>
      some(union<ExtensionParser.PlaceholderParser>([inline]), ']')(flag === '[' ? flag + rest : rest)),
    ']')),
  (ns, rest) =>
    [[html('span', some(inline)(`**WARNING: DON'T USE \`[${ns[0].textContent![0]} ]\` SYNTAX!!** This syntax is reserved for extensibility.`)![0])], rest]
), false);
