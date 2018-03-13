import { ExtensionParser } from '../../block';
import { some } from '../../../combinator';
import { block as block_ } from '../../source/block';
import { block } from '../../block';
import { firstline } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { text } from '../../util';

const syntax = /^(~{3,})([^\n]*)\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/;

export const placeholder: ExtensionParser.PlaceholderParser = block_(source => {
  if (!source.startsWith('~~~')) return;
  const [whole = '', bracket = ''] = source.match(syntax) || [];
  if (!whole) return;
  const [[message]] = block("**WARNING: DON'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.")!;
  source = source.slice(source.indexOf('\n') + 1);
  const lines: string[] = [];
  while (true) {
    const line = firstline(source);
    if (line.startsWith(`${bracket}`) && line.trim() === `${bracket}`) break;
    void lines.push(text((some(unescsource)(`${line}\n`) || [[] as Text[]])[0]));
    source = source.slice(line.length + 1);
    if (source === '') return;
  }
  return [[message], source.slice(firstline(source).length + 1)];
});
