import { TableParser } from '../block';
import { union, sequence, some, match, surround, contract, fmap, bind, trimEnd, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { inline } from '../inline';
import { compress, hasMedia } from '../util';
import { concat } from 'spica/concat';
import { html, text } from 'typed-dom';

export const table: TableParser = block(fmap(build(() =>
  sequence<TableParser>([
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
      void rows
        .forEach(row =>
          void align(row, extend(aligns, row.children.length)));
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
  }));

const row = <P extends TableParser.CellParser>(parser: P, strict: boolean): TableParser.RowParser => fmap(
  line(contract('|', trimEnd(surround('', some(union([parser])), /^\|?$/, strict)), ns => !hasMedia(html('b', ns))), true, true),
  es =>
    [html('tr', es)]);

const cell = <P extends TableParser.DataParser | TableParser.AlignParser>(parser: P): TableParser.CellParser => fmap(
  union([parser]),
  ns =>
    [html('td', ns)]);

const data: TableParser.DataParser = build(() => bind(
  surround(
    /^\|\s*/,
    compress(union([some(inline, /^\s*(?:\||$)/)])),
    /^\s*/,
    false),
  (ns, rest) =>
    ns.length === 0 && rest === ''
      ? undefined
      : [concat([text('')], ns), rest]));

const align: TableParser.AlignParser =
  surround(
    '|',
    union([
      match(/^:-+:/, (_, rest) => [[text('center')], rest]),
      match(/^:-+/, (_, rest) => [[text('left')], rest]),
      match(/^-+:/, (_, rest) => [[text('right')], rest]),
      match(/^-+/, (_, rest) => [[text('')], rest]),
    ]),
    '');
