import { ExtensionParser } from '../../block';
import { verify } from '../util/verification';
import { some } from '../../../combinator';
import { block } from '../../block';
import { unescsource } from '../../source/unescapable';

const syntax = /^(~{3,})([^\n]*)\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/;

export const placeholder: ExtensionParser.PlaceholderParser = verify(source => {
  if (!source.startsWith('~~~')) return;
  const [whole = '', bracket = ''] = source.match(syntax) || [];
  if (!whole) return;
  const [[message]] = block("**WARNING: DON'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.")!;
  source = source.slice(source.indexOf('\n') + 1);
  const lines: string[] = [];
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.startsWith(`${bracket}`) && line.trim() === `${bracket}`) break;
    void lines.push((some(unescsource)(`${line}\n`) || [[] as Text[]])[0].reduce((acc, n) => acc + n.textContent!, ''));
    source = source.slice(line.length + 1);
    if (source === '') return;
  }
  return [[message], source.slice(source.split('\n', 1)[0].length + 1)];
});
