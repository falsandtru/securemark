import { TableParser } from '../block';
import { union, sequence, some, block, line, validate, focus, creator, surround, open, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { inline } from '../inline';
import { push } from 'spica/array';
import { html } from 'typed-dom';

import RowParser = TableParser.RowParser;
import CellParser = TableParser.CellParser;

export const table: TableParser = lazy(() => block(fmap(validate(
  /^\|[^\n]*(?:\n\|[^\n]*){2,}/,
  sequence([
    row(some(data), true),
    row(some(align), false),
    some(row(some(data), true)),
  ])),
  rows => [
    html('table', [
      html('thead', [rows.shift()!]),
      html('tbody', format(rows, push([], rows.shift()!.children).map(el => el.textContent!))),
    ]),
  ])));

function format(rows: HTMLTableRowElement[], aligns: string[]): HTMLTableRowElement[] {
  assert(aligns.length > 0);
  for (let i = 0, len = rows.length; i < len; ++i) {
    const row = rows[i];
    const cols = row.children;
    for (let i = 0, len = cols.length; i < len; ++i) {
      if (i > 0 && !aligns[i]) {
        aligns[i] = aligns[i - 1];
      }
      if (!aligns[i]) continue;
      cols[i].setAttribute('align', aligns[i]);
    }
  }
  return rows;
}

const row = <P extends CellParser>(parser: P, optional: boolean): RowParser<P> => creator(fmap(
  line(surround(/^(?=\|)/, some(union([parser])), /^\|?\s*$/, optional)),
  es => [html('tr', es)]));

const data: CellParser.DataParser = creator(fmap(surround(
  /^\|(?:\\?\s)*(?=\S)/,
  some(union([inline]), /^(?:\\?\s)*(?=\||\\?$)/),
  /^[^|]*/, true),
  ns => [html('td', defrag(ns))]));

const align: CellParser.AlignParser = creator(fmap(open(
  '|',
  union([
    focus(/^:-+:/, () => [['center'], '']),
    focus(/^:-+/, () => [['start'], '']),
    focus(/^-+:/, () => [['end'], '']),
    focus(/^-+/, () => [[''], '']),
  ])),
  ns => [html('td', defrag(ns))]));
