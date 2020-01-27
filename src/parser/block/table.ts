import { TableParser } from '../block';
import { union, sequence, some, block, line, focus, validate, surround, configure, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { defrag } from '../util';
import { concat } from 'spica/concat';
import { html, text } from 'typed-dom';

const { Array } = global;

import RowParser = TableParser.RowParser;
import CellParser = RowParser.CellParser;

export const table: TableParser = lazy(() => block(fmap(validate(
  '|',
  configure({ syntax: { inline: { media: false } } },
  sequence([
    row(cell(data), false),
    row(cell(alignment), true),
    some(row(cell(data), false)),
  ]))),
  ([head, alignment, ...rows]) => {
    assert(alignment.children.length > 0);
    void align(head, alignment, rows);
    return [html('table', [html('thead', [head]), html('tbody', rows)])];
  })));

function align(head: HTMLTableRowElement, alignment: HTMLTableRowElement, rows: HTMLTableRowElement[]): void {
  const as = [...alignment.children]
    .reduce((acc, el) =>
      concat(acc, [el.textContent || acc.length > 0 && acc[acc.length - 1] || ''])
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
      ? void concat(
          aligns,
          Array(size - aligns.length)
            .fill(aligns.length > 0 ? aligns[aligns.length - 1] : ''))
      : void 0;
  }
}

const row = <P extends CellParser.ContentParser>(parser: CellParser<P>, strict: boolean): RowParser<P> => fmap(
  line(surround(/^(?=\|)/, some(union([parser])), /^\|?\s*$/, strict)),
  es => [html('tr', es)]);

const cell = <P extends CellParser.ContentParser>(parser: P): CellParser<P> => fmap(
  union([parser]),
  ns => [html('td', ns)]);

const data: CellParser.DataParser = defrag(
  surround(
    /^\|(?:\\?\s)*(?=\S)/,
    some(union([inline]), /^(?:\\?\s)*(?=\||\\?$)/),
    /^[^|]*/,
    false));

const alignment: CellParser.AlignmentParser =
  surround(
    '|',
    union([
      focus(/^:-+:/, () => [[text('center')], '']),
      focus(/^:-+/, () => [[text('left')], '']),
      focus(/^-+:/, () => [[text('right')], '']),
      focus(/^-+/, () => [[text('')], '']),
    ]),
    '');
