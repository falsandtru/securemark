import { Array } from 'spica/global';
import { TableParser } from '../block';
import { union, sequence, some, block, line, focus, validate, surround, open, update, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { inline } from '../inline';
import { html, text } from 'typed-dom';
import { push } from 'spica/array';

import RowParser = TableParser.RowParser;
import CellParser = RowParser.CellParser;

export const table: TableParser = lazy(() => block(fmap(validate(
  /^\|[^\n]*(?:\n\|[^\n]*){2,}/,
  update({ syntax: { inline: { media: false } } },
  sequence([
    row(cell(data), true),
    row(cell(alignment), false),
    some(row(cell(data), true)),
  ]))),
  ([head, alignment, ...rows]) => {
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
  for (const row of rows) {
    void apply(row, as);
  }
  return;

  function apply(row: HTMLElement, aligns: string[]): void {
    const cols = row.children;
    void extend(aligns, cols.length);
    assert(cols.length <= aligns.length);
    assert(aligns.every(align => ['left', 'center', 'right', ''].includes(align)));
    for (let i = 0; i < cols.length; ++i) {
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
  line(surround(/^(?=\|)/, some(union([parser])), /^\|?\s*$/, optional, void 0, ([, bs = []], rest) => [bs, rest])),
  es => [html('tr', es)]);

const cell = <P extends CellParser.ContentParser>(parser: P): CellParser<P> => fmap(
  union([parser]),
  ns => [defrag(html('td', ns))]);

const data: CellParser.DataParser = surround(
  /^\|(?:\\?\s)*(?=\S)/,
  some(union([inline]), /^(?:\\?\s)*(?=\||\\?$)/),
  /^[^|]*/, true,
  void 0,
  ([, bs = []], rest) => [bs, rest]);

const alignment: CellParser.AlignmentParser = open(
  '|',
  union([
    focus(/^:-+:/, () => [[text('center')], '']),
    focus(/^:-+/, () => [[text('left')], '']),
    focus(/^-+:/, () => [[text('right')], '']),
    focus(/^-+/, () => [[text('')], '']),
  ]));
