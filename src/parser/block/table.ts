import { TableParser } from '../block';
import { union, sequence, some, block, line, validate, focus, creator, surround, open, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { inline } from '../inline';
import { shift, push } from 'spica/array';
import { html } from 'typed-dom';

import RowParser = TableParser.RowParser;
import CellParser = RowParser.CellParser;

export const table: TableParser = lazy(() => block(fmap(validate(
  /^\|[^\n]*(?:\n\|[^\n]*){2,}/,
  sequence([
    row(cell(data), true),
    row(cell(align), false),
    some(row(cell(data), true)),
  ])),
  rows => {
    const [head, align] = shift(rows, 2)[0];
    const aligns = push([], align.children).map(el => el.textContent!);
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
    return [html('table', [html('thead', [head]), html('tbody', rows)])];
  })));

const row = <P extends CellParser.ContentParser>(parser: CellParser<P>, optional: boolean): RowParser<P> => fmap(
  line(surround(/^(?=\|)/, some(union([parser])), /^\|?\s*$/, optional)),
  es => [html('tr', es)]);

const cell = <P extends CellParser.ContentParser>(parser: P): CellParser<P> => creator(fmap(
  union([parser]),
  ns => [html('td', defrag(ns))]));

const data: CellParser.DataParser = surround(
  /^\|(?:\\?\s)*(?=\S)/,
  some(union([inline]), /^(?:\\?\s)*(?=\||\\?$)/),
  /^[^|]*/, true);

const align: CellParser.AlignParser = open(
  '|',
  union([
    focus(/^:-+:/, () => [['center'], '']),
    focus(/^:-+/, () => [['start'], '']),
    focus(/^-+:/, () => [['end'], '']),
    focus(/^-+/, () => [[''], '']),
  ]));
