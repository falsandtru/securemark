import { TableParser } from '../block';
import { union, sequence, some, match, capture, surround, transform, trim, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { inline } from '../inline';
import { compress } from '../util';
import { concat } from 'spica/concat';
import { html, text } from 'typed-dom';

export const table: TableParser = block(transform(build(() =>
  sequence([
    row(cell(data)),
    row(cell(align)),
    some(row(cell(data))),
  ])),
  ([head, as, ...rows], rest) => {
    if (as.children.length === 0) return;
    void align();
    return [[html('table', [html('thead', [head]), html('tbody', rows)])], rest];

    function align(): void {
      const aligns = [...as.children]
        .reduce((acc, el) =>
          concat(acc, [el.textContent || acc[acc.length - 1] || ''])
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
                .fill(aligns[aligns.length - 1] || ''))
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

const row = <P extends TableParser.CellParser>(parser: P): TableParser.RowParser => transform(
  line(match(/^\|/, trim(surround('', some(union([parser])), /^\|?$/, false))), true, true),
  (es, rest) =>
    [[html('tr', es)], rest]);

const cell = <P extends TableParser.DataParser | TableParser.AlignParser>(parser: P): TableParser.CellParser =>
  transform(union([parser]), (ns, rest) => [[html('td', ns)], rest]);

const data: TableParser.DataParser = build(() => transform(
  surround(
    /^\|\s*/,
    compress(union([some(inline, /^\s*(?:\||$)/)])),
    /^\s*/,
    false),
  (ns, rest) =>
    ns.length === 0
      ? rest === ''
        ? undefined
        : [[text('')], rest]
      : [ns, rest]));

const align: TableParser.AlignParser =
  surround(
    '|',
    union([
      capture(/^:-+:/, (_, rest) => [[text('center')], rest]),
      capture(/^:-+/, (_, rest) => [[text('left')], rest]),
      capture(/^-+:/, (_, rest) => [[text('right')], rest]),
      capture(/^-+/, (_, rest) => [[text('')], rest]),
    ]),
    '');
