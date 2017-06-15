import { Result } from '../../combinator/parser';
import { loop } from '../../combinator/loop';
import { TableParser, consumeBlockEndEmptyLine } from '../block';
import { InlineParser, inline } from '../inline';
import { squash } from '../text';

type SubParsers = [InlineParser];

const syntax = /^(\|[^\n]*)+?\s*?\n/;
const align = /^:?-+:?$/;

export const table: TableParser = function (source: string): Result<HTMLTableElement, SubParsers> {
  if (source.search(syntax) !== 0) return;
  const table = document.createElement('table');
  const [headers, hrest] = parse(source) || [[], source];
  if (hrest.length === source.length) return;
  source = hrest;
  const [aligns_, arest] = parse(source) || [[], source];
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
  void table.appendChild(document.createElement('thead'));
  void append(headers, table, headers.map((_, i) =>
    i > 1
      ? aligns[1]
      : aligns[i] === 'right'
        ? 'center'
        : aligns[i]));
  void table.appendChild(document.createElement('tbody'));
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '') break;
    const [cols, rest] = parse(line) || [[], line];
    if (rest.length !== 0) return;
    void append(headers.map((_, i) => cols[i] || document.createDocumentFragment()), table, aligns);
    source = source.slice(line.length + 1);
  }
  return consumeBlockEndEmptyLine<HTMLTableElement, SubParsers>([table], source);
};

function append(cols: DocumentFragment[], table: HTMLTableElement, aligns: string[]): void {
  return void cols
    .map((col, i) => {
      const td = document.createElement('td');
      void td.setAttribute('align', aligns[i] || '');
      void td.appendChild(col);
      return td;
    })
    .reduce((tr, td) =>
      (void tr.appendChild(td), tr)
  , table.lastChild!.appendChild(document.createElement('tr')));
}

const rowseparator = /^\||^\s*?\n/;
const rowend = /^\|?\s*?(?:\n|$)/;
function parse(source: string): [DocumentFragment[], string] | undefined {
  const cols = [];
  while (true) {
    if (source[0] !== '|') return;
    const result = loop(inline, rowseparator)(source.slice(1)) || [[document.createTextNode('')], source.slice(1)];
    const [col, rest] = result;
    assert(rest.length < source.length);
    source = rest;
    void cols.push(trim(squash(col)));
    if (source.search(rowend) === 0) return [cols, source.slice(source.split('\n')[0].length + 1)];
  }
}

function trim(n: DocumentFragment): DocumentFragment {
  if (!n.firstChild || !n.lastChild) return n;
  if (n.firstChild === n.firstElementChild) return n;
  n.firstChild.textContent = n.firstChild.textContent!.replace(/^\s+/, '');
  if (n.lastChild === n.lastElementChild) return n;
  n.lastChild.textContent = n.lastChild.textContent!.replace(/\s+$/, '');
  return n;
}
