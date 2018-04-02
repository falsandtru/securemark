import { ExtensionParser } from '../../block';
import { some, match } from '../../../combinator';
import { block } from '../../source/block';
import { paragraph } from '../paragraph';
import { firstline } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { stringify } from '../../util';

const syntax = /^(~{3,})([^\n]*)\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/;

export const placeholder: ExtensionParser.PlaceholderParser = block(match(syntax, ([, bracket], source) => {
  const [[message]] = paragraph("**WARNING: DON'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.")!;
  source = source.slice(source.indexOf('\n') + 1);
  const lines: string[] = [];
  while (true) {
    const line = firstline(source);
    if (line.startsWith(`${bracket}`) && line.trim() === `${bracket}`) break;
    void lines.push(stringify((some(unescsource)(`${line}\n`) || [[]])[0]));
    source = source.slice(line.length + 1);
    if (source === '') return;
  }
  return [[message], source.slice(firstline(source).length + 1)];
}));
