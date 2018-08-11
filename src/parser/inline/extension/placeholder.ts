import { ExtensionParser, inline } from '../../inline';
import { union, some, fmap, match, surround, subline, build, eval } from '../../../combinator';
import { html } from 'typed-dom';

// Already used symbols: !@$&*<
export const placeholder: ExtensionParser.PlaceholderParser = subline(fmap(build(() =>
  surround(
    '[',
    match(/^[~^]/, ([flag], rest) =>
      some(union<ExtensionParser.PlaceholderParser>([inline]), ']')(flag === '[' ? flag + rest : rest)),
    ']')),
  ns =>
    [html('span', { class: 'invalid' }, eval(some(inline)(`Invalid syntax: Extension syntax: \`[${ns[0].textContent![0]} ]\`.`)))]));
