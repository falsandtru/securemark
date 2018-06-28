import { ExtensionParser, inline } from '../../inline';
import { union, some, match, surround, fmap, build, eval } from '../../../combinator';
import { line } from '../../source/line';
import { html } from 'typed-dom';

// Already used symbols: !@$*<
export const placeholder: ExtensionParser.PlaceholderParser = line(fmap(build(() =>
  surround(
    '[',
    match(/^[#:~^\[]/, ([flag], rest) =>
      some(union<ExtensionParser.PlaceholderParser>([inline]), ']')(flag === '[' ? flag + rest : rest)),
    ']')),
  ns =>
    [html('span', eval(some(inline)(`*Invalid syntax: Extension syntax: \`[${ns[0].textContent![0]} ]\`.*`)))]
), false);
