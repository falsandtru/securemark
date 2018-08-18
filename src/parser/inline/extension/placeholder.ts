﻿import { ExtensionParser, inline } from '../../inline';
import { union, some, fmap, surround, validate, subline, build, eval } from '../../../combinator';
import { html } from 'typed-dom';

// Already used symbols: !@$&*<
export const placeholder: ExtensionParser.PlaceholderParser = subline(fmap(build(() =>
  surround(
    '[',
    validate(/^[~^@](?!\])/, some(union<ExtensionParser.PlaceholderParser>([inline]), ']')),
    ']')),
  ns =>
    [html('span', { class: 'invalid' }, eval(some(inline)(`Invalid syntax: Extension syntax: \`[${ns[0].textContent![0]} ]\`.`)))]));
