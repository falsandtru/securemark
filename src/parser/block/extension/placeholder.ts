﻿import { Markdown } from '../../../../markdown.d';
import { verify } from '../util/verification';
import { Parser, loop } from '../../../combinator';
import { block } from '../../block';
import { unescsource } from '../../source/unescapable';
import { squash } from '../../squash';

export interface PlaceholderParser extends
  Markdown<'extensionblock' & 'extensionblock/placeholder'>,
  Parser<HTMLElement, never[]> {
}
const syntax = /^(~{3,})([^\n]*)\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/;

export const placeholder: PlaceholderParser = verify(source => {
  if (!source.startsWith('~~~')) return;
  const [whole = '', keyword = '', notes = ''] = source.match(syntax) || [];
  if (!whole) return;
  const [[message]] = block("**WARNING: DON'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.")!;
  source = source.slice(source.indexOf('\n') + 1);
  const lines: string[] = [];
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.startsWith(`${keyword}`) && line.trim() === `${keyword}`) break;
    void lines.push(squash((loop(unescsource)(`${line}\n`) || [[]])[0]).textContent!);
    source = source.slice(line.length + 1);
    if (source === '') return;
  }
  const quote = document.createElement('pre');
  void quote.appendChild(document.createTextNode(`${keyword}${notes}\n${lines.join('')}${keyword}`));
  return [[message, quote], source.slice(source.split('\n', 1)[0].length + 1)];
});
