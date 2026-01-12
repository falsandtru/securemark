import { TableParser } from '../block';
import { union, sequence, some, block, line, validate, focus, rewrite, surround, open, close, trimStart, fallback, lazy, fmap } from '../../combinator';
import { inline, media, medialink, shortmedia } from '../inline';
import { contentline } from '../source';
import { trimBlank } from '../visibility';
import { duffReduce } from 'spica/duff';
import { push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

import RowParser = TableParser.RowParser;
import AlignParser = TableParser.AlignParser;
import CellParser = TableParser.CellParser;

export const table: TableParser = lazy(() => block(fmap(validate(
  /^\|[^\n]*(?:\n\|[^\n]*){2}/,
  sequence([
    row(some(head), true),
    row(some(align), false),
    some(row(some(data), true)),
  ])),
  rows => [
    html('table', [
      html('thead', [rows.shift()!]),
      html('tbody', format(rows)),
    ]),
  ])));

const row = <P extends CellParser | AlignParser>(parser: P, optional: boolean): RowParser<P> => fallback(fmap(
  line(surround(/^(?=\|)/, some(union([parser])), /^[|\\]?\s*$/, optional)),
  es => [html('tr', es)]),
  rewrite(contentline, ({ source }) => [[
    html('tr', {
      class: 'invalid',
      'data-invalid-syntax': 'table-row',
      'data-invalid-type': 'syntax',
      'data-invalid-message': 'Missing the start symbol of the table row',
    }, [html('td', source.replace('\n', ''))])
  ], '']));

const align: AlignParser = fmap(open(
  '|',
  union([
    focus(/^:-+:/, () => [['center'], '']),
    focus(/^:-+/, () => [['start'], '']),
    focus(/^-+:/, () => [['end'], '']),
    focus(/^-+/, () => [[''], '']),
  ])),
  ns => [html('td', defrag(ns))]);

const cell: CellParser = surround(
  /^\|\s*(?=\S)/,
  trimStart(union([
    close(medialink, /^\s*(?=\||$)/),
    close(media, /^\s*(?=\||$)/),
    close(shortmedia, /^\s*(?=\||$)/),
    trimBlank(some(inline, /^\|/, [[/^[|\\]?\s*$/, 9]])),
  ])),
  /^[^|]*/, true);

const head: CellParser.HeadParser = fmap(
  cell,
  ns => [html('th', defrag(ns))]);

const data: CellParser.DataParser = fmap(
  cell,
  ns => [html('td', defrag(ns))]);

function format(rows: HTMLTableRowElement[]): HTMLTableRowElement[] {
  const aligns = rows[0].className === 'invalid'
    ? []
    : duffReduce(rows.shift()!.children, (acc, el) => push(acc, [el.textContent!]), [] as string[]);
  for (let i = 0; i < rows.length; ++i) {
    for (let cols = rows[i].children, len = cols.length, j = 0; j < len; ++j) {
      if (j > 0 && !aligns[j]) {
        aligns[j] = aligns[j - 1];
      }
      if (!aligns[j]) continue;
      cols[j].setAttribute('align', aligns[j]);
    }
  }
  return rows;
}
