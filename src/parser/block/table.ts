import { TableParser } from '../block';
import { verify } from './util/verification';
import { loop } from '../../combinator';
import { inline } from '../inline';
import { squash } from '../squash';
import { html } from 'typed-dom';

const syntax = /^(\|[^\n]*)+?[^\S\n]*\n/;
const align = /^:?-+:?$/;

export const table: TableParser = verify(source => {
  if (!source.startsWith('|') || source.search(syntax) !== 0) return;
  const table = html('table');
  const [headers = [], hrest = source] = parse(source) || [];
  if (hrest.length === source.length) return;
  source = hrest;
  const [aligns_ = [], arest = source] = parse(source) || [];
  if (arest.length === source.length) return;
  source = arest;
  if (aligns_.some(e => !e.textContent || e.textContent!.search(align) !== 0)) return;
  const aligns = headers
    .map((_, i) => (aligns_[i] || aligns_[aligns_.length - 1]).textContent!)
    .map(s =>
      s[0] === ':'
        ? s[s.length - 1] === ':'
          ? 'center'
          : 'left'
        : s[s.length - 1] === ':'
          ? 'right'
          : '');
  void table.appendChild(html('thead'));
  void append(headers, table, headers.map((_, i) =>
    i > 1
      ? aligns[1]
      : aligns[i] === 'right'
        ? 'center'
        : aligns[i]));
  void table.appendChild(html('tbody'));
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '') break;
    const [cols = [], rest = line] = parse(line) || [];
    if (rest.length !== 0) return;
    void append(headers.map((_, i) => cols[i] || document.createDocumentFragment()), table, aligns);
    source = source.slice(line.length + 1);
  }
  return [[table], source];
});

function append(cols: DocumentFragment[], table: HTMLTableElement, aligns: string[]): void {
  return void cols
    .reduce((tr, col, i) =>
      (void tr.appendChild(html('td', { align: aligns[i] || '' }, [col])), tr)
  , table.lastChild!.appendChild(html('tr')));
}

const rowseparator = /^\||^[^\S\n]*(?=\n|$)/;
const rowend = /^\|?[^\S\n]*(?=\n|$)/;
function parse(row: string): [DocumentFragment[], string] | undefined {
  const cols: DocumentFragment[] = [];
  while (true) {
    if (row[0] !== '|') return;
    const [, rest = row.slice(1)] = loop(inline, rowseparator)(row.slice(1)) || [];
    const [col = []] = loop(inline)(row.slice(1, row.length - rest.length).trim()) || [];
    assert(rest.length < row.length);
    row = rest;
    void cols.push(squash(col, document.createDocumentFragment()));
    if (row.search(rowend) === 0) return [cols, row.slice(row.split('\n')[0].length + 1)];
  }
}
