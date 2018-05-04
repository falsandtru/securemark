import { TableParser } from '../block';
import { union, sequence, some, surround, transform, trim, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { inline } from '../inline';
import { compress } from '../util';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

export const table: TableParser = block(transform(build(() =>
  sequence([
    row,
    align,
    some(row),
  ])),
  ([head, as, ...rows], rest) => {
    const aligns = [...as.children].map(el => el.innerHTML);
    void align(head, [aligns[0] || '', aligns[1] || aligns[0] || '']);
    void rows
      .forEach(row => void align(row, aligns));
    return [[html('table', [html('thead', [head]), html('tbody', rows)])], rest];

    function align(row: HTMLElement, aligns: string[]): void {
      aligns = aligns.concat(Array(Math.max(row.children.length - aligns.length, 0)).fill(aligns[aligns.length - 1] || ''));
      return void [...row.children]
        .forEach((col, i) =>
          aligns[i] &&
          void col.setAttribute('style', `text-align: ${sanitize(aligns[i])};`));

      function sanitize(align: string): string {
        return ['left', 'center', 'right'].includes(align)
          ? align
          : '';
      }
    }
  }));

const align: TableParser.RowParser = transform(build(() =>
  row),
  ([row], rest) => {
    return [...row.children].every(cell => !!cell.innerHTML!.match(/^:?-+:?$/))
      ? [[aligns()], rest]
      : undefined;

    function aligns(): HTMLElement {
      return html(
        'tr',
        [...row.children]
          .reduce<string[]>((as, el) =>
            el.innerHTML.startsWith(':')
              ? el.innerHTML.endsWith(':')
                ? concat(as, ['center'])
                : concat(as, ['left'])
              : el.innerHTML.endsWith(':')
                ? concat(as, ['right'])
                : concat(as, [as[as.length - 1] || ''])
          , [])
          .map(s => html('td', s)));
    }
  });

const row: TableParser.RowParser = transform(
  line(trim(
    surround(
      '|',
      some(transform(
        surround(/^\s*/, compress(some(union([inline]), /^\s*\|/)), /^\s*\|?/, false),
        (ns, rest) => [[html('td', ns)], rest])),
      '',
      false)
    ), true, true),
  (es, rest) =>
    [[html('tr', es)], rest]);
