import { Array } from 'spica/global';
import { TableParser } from '../block';
import { union, sequence, some, block, line, focus, validate, context, fmap, surround, open, lazy } from '../../combinator';
import { defrag } from '../util';
import { inline } from '../inline';
import { html } from 'typed-dom';
import { shift, push } from 'spica/array';

import RowParser = TableParser.RowParser;
import CellParser = RowParser.CellParser;

export const table: TableParser = lazy(() => block(fmap(validate(
  /^\|[^\n]*(?:\n\|[^\n]*){2,}/,
  context({ syntax: { inline: { media: false } } },
  sequence([
    row(cell(data), true),
    row(cell(alignment), false),
    some(row(cell(data), true)),
  ]))),
  rows => {
    const [head, alignment] = shift(rows, 2)[0];
    assert(alignment.children.length > 0);
    void align(head, alignment, rows);
    return [html('table', [html('thead', [head]), html('tbody', rows)])];
  })));

function align(head: HTMLTableRowElement, alignment: HTMLTableRowElement, rows: HTMLTableRowElement[]): void {
  const as = [...alignment.children]
    .reduce((acc, el) =>
      push(acc, [el.textContent || acc.length > 0 && acc[acc.length - 1] || ''])
    , []);
  void apply(head, as.slice(0, 2));
  for (let i = 0, len = rows.length; i < len; ++i) {
    void apply(rows[i], as);
  }
  return;

  function apply(row: HTMLElement, aligns: string[]): void {
    const cols = row.children;
    const len = cols.length;
    void extend(aligns, len);
    assert(len <= aligns.length);
    assert(aligns.every(align => ['left', 'center', 'right', ''].includes(align)));
    for (let i = 0; i < len; ++i) {
      if (!aligns[i]) continue;
      void cols[i].setAttribute('style', `text-align: ${aligns[i]};`);
    }
  }

  function extend(aligns: string[], size: number): void {
    return size > aligns.length
      ? void push(
          aligns,
          Array(size - aligns.length)
            .fill(aligns.length > 0 ? aligns[aligns.length - 1] : ''))
      : void 0;
  }
}

const row = <P extends CellParser.ContentParser>(parser: CellParser<P>, optional: boolean): RowParser<P> => fmap(
  line(surround(/^(?=\|)/, some(union([parser])), /^\|?\s*$/, optional)),
  es => [html('tr', es)]);

const cell = <P extends CellParser.ContentParser>(parser: P): CellParser<P> => fmap(
  union([parser]),
  ns => [html('td', defrag(ns))]);

const data: CellParser.DataParser = surround(
  /^\|(?:\\?\s)*(?=\S)/,
  some(union([inline]), /^(?:\\?\s)*(?=\||\\?$)/),
  /^[^|]*/, true);

const alignment: CellParser.AlignmentParser = open(
  '|',
  union([
    focus(/^:-+:/, () => [['center'], '']),
    focus(/^:-+/, () => [['left'], '']),
    focus(/^-+:/, () => [['right'], '']),
    focus(/^-+/, () => [[''], '']),
  ]));
