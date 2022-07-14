import { TableParser } from '../block';
import { union, sequence, some, creation, block, line, validate, focus, rewrite, surround, open, fallback, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { contentline } from '../source';
import { trimNode } from '../visibility';
import { html, defrag } from 'typed-dom/dom';
import { duffEach, duffReduce } from 'spica/duff';
import { push } from 'spica/array';

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

const row = <P extends CellParser | AlignParser>(parser: P, optional: boolean): RowParser<P> => creation(fallback(fmap(
  line(surround(/^(?=\|)/, some(union([parser])), /^[|\\]?\s*$/, optional)),
  es => [html('tr', es)]),
  rewrite(contentline, ({ source }) => [[
    html('tr', {
      class: 'invalid',
      'data-invalid-syntax': 'table-row',
      'data-invalid-type': 'syntax',
      'data-invalid-message': 'Missing the start symbol of the table row',
    }, [html('td', source.replace('\n', ''))])
  ], ''])));

const align: AlignParser = creation(fmap(open(
  '|',
  union([
    focus(/^:-+:/, () => [['center'], '']),
    focus(/^:-+/, () => [['start'], '']),
    focus(/^-+:/, () => [['end'], '']),
    focus(/^-+/, () => [[''], '']),
  ])),
  ns => [html('td', defrag(ns))]));

const cell: CellParser = surround(
  /^\|\s*(?=\S)/,
  some(union([inline]), /^\|/, [[/^[|\\]?\s*$/, 9]]),
  /^[^|]*/, true);

const head: CellParser.HeadParser = creation(fmap(
  cell,
  ns => [html('th', trimNode(defrag(ns)))]));

const data: CellParser.DataParser = creation(fmap(
  cell,
  ns => [html('td', trimNode(defrag(ns)))]));

function format(rows: HTMLTableRowElement[]): HTMLTableRowElement[] {
  const aligns = rows[0].className === 'invalid'
    ? []
    : duffReduce(rows.shift()!.children, (acc, el) => push(acc, [el.textContent!]), [] as string[]);
  for (let i = 0; i < rows.length; ++i) {
    duffEach(rows[i].children, (col, i) => {
      if (i > 0 && !aligns[i]) {
        aligns[i] = aligns[i - 1];
      }
      if (!aligns[i]) return;
      col.setAttribute('align', aligns[i]);
    });
  }
  return rows;
}
