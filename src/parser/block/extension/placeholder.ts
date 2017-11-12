﻿import { Markdown } from '../../../../markdown.d';
import { verifyBlockEnd } from '../end';
import { Parser, loop } from '../../../combinator';
import { inline } from '../../inline';
import { unescsource } from '../../source/unescapable';
import { squash } from '../../squash';

export interface PlaceholderParser extends
  Markdown<'extensionblock' & 'extensionblock/placeholder'>,
  Parser<HTMLElement, never[]> {
}
const syntax = /^(~{3,})[^\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?=\n|$)/;

export const placeholder: PlaceholderParser = verifyBlockEnd(function (source: string): [HTMLElement[], string] | undefined {
  if (!source.startsWith('~~~')) return;
  const [whole, keyword] = source.match(syntax) || ['', ''];
  if (!whole) return;
  const message = document.createElement('p');
  void message.appendChild(squash(loop(inline)("**WARNING: DON'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.")![0]));
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
  void quote.appendChild(document.createTextNode(`${keyword}\n${lines.join('')}${keyword}`));
  return [[message, quote], source.slice(keyword.length + 1)];
});
