import { TableParser } from '../block';
import { union, sequence, some, block, line, focus, validate, verify, surround, trimEnd, lazy, fmap, bind } from '../../combinator';
import { inline } from '../inline';
import { hasMedia, squash } from '../util';
import { concat } from 'spica/concat';
import { html, text } from 'typed-dom';

import RowParser = TableParser.RowParser;
import CellParser = RowParser.CellParser;

export const table: TableParser = lazy(() => block(fmap(validate(
  /^|/,
  sequence([
    row(cell(data), false),
    row(cell(align), true),
    some(row(cell(data), false)),
  ])),
  ([head, as, ...rows]) => {
    assert(as.children.length > 0);
    void align();
    return [html('table', [html('thead', [head]), html('tbody', rows)])];

    function align(): void {
      const aligns = [...as.children]
        .reduce((acc, el) =>
          concat(acc, [el.textContent || acc.length > 0 && acc[acc.length - 1] || ''])
        , []);
      void align(head, extend(aligns.slice(0, 2), head.children.length));
      for (const row of rows) {
        void align(row, extend(aligns, row.children.length));
      }
      return;

      function extend(aligns: string[], size: number): string[] {
        return size > aligns.length
          ? concat(
              aligns,
              Array(size - aligns.length)
                .fill(aligns.length > 0 ? aligns[aligns.length - 1] : ''))
          : aligns;
      }

      function align(row: HTMLElement, aligns: string[]): void {
        assert(row.children.length <= aligns.length);
        return void [...row.children]
          .forEach((col, i) =>
            aligns[i] &&
            aligns[i] === sanitize(aligns[i]) &&
            void col.setAttribute('style', `text-align: ${sanitize(aligns[i])};`));
      }

      function sanitize(align: string): string {
        assert(['left', 'center', 'right', ''].includes(align));
        return ['left', 'center', 'right'].includes(align)
          ? align
          : '';
      }
    }
  })));

const row = <P extends CellParser.IncellParser>(parser: CellParser<P>, strict: boolean): RowParser<P> => verify(fmap(
  line(trimEnd(surround(/^(?=\|)/, some(union([parser])), /^\|?$/, strict))),
  es => [html('tr', es)]),
  ([el]) => !hasMedia(el));

const cell = <P extends CellParser.IncellParser>(parser: P): CellParser<P> => fmap(
  union([parser]),
  ns => [html('td', ns)]);

const data: CellParser.DataParser = bind(
  surround(
    /^\|\s*/,
    union([some(inline, /^\s*(?:\||$)/)]),
    /^\s*/,
    false),
  (ns, rest) =>
    ns.length === 0 && rest === ''
      ? undefined
      : [squash(ns), rest]);

const align: CellParser.AlignParser =
  surround(
    '|',
    union([
      focus(/^:-+:/, _ => [[text('center')], '']),
      focus(/^:-+/, _ => [[text('left')], '']),
      focus(/^-+:/, _ => [[text('right')], '']),
      focus(/^-+/, _ => [[text('')], '']),
    ]),
    '');
