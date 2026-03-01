import { TableParser } from '../block';
import { List, Data } from '../../combinator/data/parser';
import { union, sequence, some, block, line, validate, focus, rewrite, surround, open, close, fallback, lazy, fmap } from '../../combinator';
import { inline, media, medialink, shortmedia } from '../inline';
import { contentline } from '../source';
import { trimBlank } from '../visibility';
import { unwrap, invalid } from '../util';
import { duffReduce } from 'spica/duff';
import { push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

import RowParser = TableParser.RowParser;
import AlignParser = TableParser.AlignParser;
import CellParser = TableParser.CellParser;

export const table: TableParser = lazy(() => block(fmap(validate(
  /\|[^\n]*(?:\n\|[^\n]*){2}/y,
  sequence([
    row(some(head), true),
    row(some(align), false),
    some(row(some(data), true)),
  ])),
  rows => new List([
    new Data(html('table', [
      html('thead', [rows.shift()!.value]),
      html('tbody', unwrap(format(rows))),
    ])),
  ]))));

const row = <P extends CellParser | AlignParser>(parser: P, optional: boolean): RowParser<P> => fallback(fmap(
  line(surround(/(?=\|)/y, some(union([parser])), /[|\\]?\s*$/y, optional)),
  ns => new List([new Data(html('tr', unwrap(ns)))])),
  rewrite(contentline, ({ context: { source } }) => new List([
    new Data(html('tr', {
      class: 'invalid',
      ...invalid('table-row', 'syntax', 'Missing the start symbol of the table row'),
    }, [html('td', source.replace('\n', ''))]))
  ])));

const align: AlignParser = fmap(open(
  '|',
  union([
    focus(/:-+:?/y, ({ context: { source } }) =>
      new List([new Data(source.at(-1) === ':' ? 'center' : 'start')])),
    focus(/-+:?/y, ({ context: { source } }) =>
      new List([new Data(source.at(-1) === ':' ? 'end' : '')])),
  ])),
  ns => new List([new Data(html('td', defrag(unwrap(ns))))]));

const cell: CellParser = surround(
  /\|\s*(?=\S)/y,
  union([
    close(medialink, /\s*(?=\||$)/y),
    close(media, /\s*(?=\||$)/y),
    close(shortmedia, /\s*(?=\||$)/y),
    trimBlank(some(inline, /\|/y, [[/[|\\]?\s*$/y, 9]])),
  ]),
  /[^|]*/y, true);

const head: CellParser.HeadParser = fmap(
  cell,
  ns => new List([new Data(html('th', defrag(unwrap(ns))))]));

const data: CellParser.DataParser = fmap(
  cell,
  ns => new List([new Data(html('td', defrag(unwrap(ns))))]));

function format(rows: List<Data<HTMLTableRowElement>>): List<Data<HTMLTableRowElement>> {
  const aligns = rows.head!.value.className === 'invalid'
    ? []
    : duffReduce(rows.shift()!.value.children, (acc, el) => push(acc, [el.textContent!]), [] as string[]);
  for (const { value: row } of rows) {
    for (let cols = row.children, len = cols.length, j = 0; j < len; ++j) {
      if (j > 0 && !aligns[j]) {
        aligns[j] = aligns[j - 1];
      }
      if (!aligns[j]) continue;
      cols[j].setAttribute('align', aligns[j]);
    }
  }
  return rows;
}
