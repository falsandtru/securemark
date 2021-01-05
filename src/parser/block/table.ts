import { undefined, Array } from 'spica/global';
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
    row(cell(alignment), false),
    some(row(cell(data), true)),
  ])),
  rows => {
    const [head, alignment] = shift(rows, 2)[0];
    assert(alignment.children.length > 0);
    align(head, alignment, rows);
    return [html('table', [html('thead', [head]), html('tbody', rows)])];
  })));

function align(head: HTMLTableRowElement, alignment: HTMLTableRowElement, rows: HTMLTableRowElement[]): void {
  const as: string[] = Array(alignment.childElementCount);
  for (let i = 0, es = alignment.children; i < as.length; ++i) {
    as[i] = es[i].textContent || i > 0 && as[i - 1] || '';
  }
  apply(head, as.slice(0, 2));
  for (let i = 0, len = rows.length; i < len; ++i) {
    apply(rows[i], as);
  }
  return;

  function apply(row: HTMLElement, aligns: string[]): void {
    const cols = row.children;
    const len = cols.length;
    extend(aligns, len);
    assert(len <= aligns.length);
    assert(aligns.every(align => ['start', 'center', 'end', ''].includes(align)));
    for (let i = 0; i < len; ++i) {
      if (!aligns[i]) continue;
      cols[i].setAttribute('align', aligns[i]);
    }
  }

  function extend(aligns: string[], size: number): void {
    return size > aligns.length
      ? void push(
          aligns,
          Array(size - aligns.length)
            .fill(aligns.length > 0 ? aligns[aligns.length - 1] : ''))
      : undefined;
  }
}

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

const alignment: CellParser.AlignmentParser = open(
  '|',
  union([
    focus(/^:-+:/, () => [['center'], '']),
    focus(/^:-+/, () => [['start'], '']),
    focus(/^-+:/, () => [['end'], '']),
    focus(/^-+/, () => [[''], '']),
  ]));
