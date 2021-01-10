import { undefined, Math, Array } from 'spica/global';
import { isArray } from 'spica/alias';
import { ExtensionParser } from '../../block';
import { union, subsequence, inits, some, block, line, validate, fence, rewrite, creator, open, clear, trim, recover, lazy, fmap, bind } from '../../../combinator';
import { Data } from '../../../combinator/data/parser';
import { dup, defrag } from '../../util';
import { inline } from '../../inline';
import { str, anyline, emptyline, contentline } from '../../source';
import { unshift, splice } from 'spica/array';
import { html } from 'typed-dom';

import TableParser = ExtensionParser.TableParser;
import RowParser = TableParser.RowParser;
import AlignParser = TableParser.AlignParser;
import CellParser = TableParser.CellParser;

const opener = /^(~{3,})table(?!\S)([^\n]*)(?:$|\n)/;

export const segment: TableParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 1000))));

export const segment_: TableParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 1000, false))), false);

export const table: TableParser = block(validate('~~~', recover(bind(
  fence(opener, 1000),
  // Bug: Type mismatch between outer and inner.
  ([body, closer, opener, delim, param]: string[], _, context) => {
    if (!closer || param.trimStart() !== '') return [[html('pre', {
      class: `notranslate invalid`,
      'data-invalid-syntax': 'table',
      'data-invalid-type': closer ? 'argument' : 'closer',
      'data-invalid-description': closer ? 'Invalid argument.' : `Missing the closing delimiter ${delim}.`,
    }, `${opener}${body}${closer}`)], ''];
    return parser(body, context) ?? [[html('table')], ''];
  }),
  (source, _, reason) =>
    reason instanceof Error && reason.message === 'Number of columns must be 32 or less.'
      ? [[
          html('pre', {
            class: `notranslate invalid`,
            'data-invalid-syntax': 'table',
            'data-invalid-type': 'content',
            'data-invalid-description': reason.message,
          }, source),
        ], '']
      : (() => { throw reason; })())));

const parser: TableParser = lazy(() => block(fmap(
  some(union([row])),
  rows => [html('table', format(rows))])));

const row: RowParser = lazy(() => dup(fmap(
  subsequence([
    dup(union([
      align,
    ])),
    some(union([
      head,
      data,
      dataline,
      emptyline,
    ]), alignment),
  ]),
  ns => !isArray(ns[0]) ? unshift([[[]]], ns) : ns)));

const alignment = /^#?(?:[-=<>]+(?:\/[-=^v]*)?|\/[-=^v]+)(?=[^\S\n]*\n)/;

const align: AlignParser = line(fmap(
  union([str(alignment)]),
  ([s]) => s.split('/').map(s => s.split(''))));

const delimiter = /^#?(?:[-=<>]+(?:\/[-=^v]*)?|\/[-=^v]+)(?=[^\S\n]*\n)|^[#:](?:\d*:\d*)?!*(?=[^\S\n])/;

const head: CellParser.HeadParser = creator(block(fmap(open(
  str(/^#(?:\d*:\d*)?!*(?=[^\S\n])/),
  rewrite(
    inits([
      anyline,
      some(contentline, delimiter),
    ]),
    trim(some(union([inline])))),
  true),
  ns => [html('th', attributes(ns.shift()! as string), defrag(ns))]),
  false));

const data: CellParser.DataParser = creator(block(fmap(open(
  str(/^:(?:\d*:\d*)?!*(?=[^\S\n])/),
  rewrite(
    inits([
      anyline,
      some(contentline, delimiter),
    ]),
    trim(some(union([inline])))),
  true),
  ns => [html('td', attributes(ns.shift()! as string), defrag(ns))]),
  false));

const dataline: CellParser.DataParser = creator(line(fmap(
  rewrite(
    contentline,
    trim(some(union([inline])))),
  ns => [html('td', defrag(ns))])));

function attributes(source: string) {
  let [, rowspan = undefined, colspan = undefined, highlight = undefined] = source.match(/^.(?:(\d+)?:(\d+)?)?(!+)?$/) ?? [];
  rowspan === '1' ? rowspan = undefined : undefined;
  colspan === '1' ? colspan = undefined : undefined;
  rowspan &&= Math.max(0, Math.min(+rowspan, 65534)) + '';
  colspan &&= Math.max(0, Math.min(+colspan, 1000)) + '';
  highlight &&= highlight.length > 0 ? highlight.length + '' : undefined;
  const valid = !highlight ||
    source[0] === '#' && +highlight <= 1 ||
    source[0] === ':' && +highlight <= 5;
  return {
    class: valid ? highlight && 'highlight' : 'invalid',
    rowspan,
    colspan,
    ...valid
      ? { 'data-highlight-level': +highlight! > 1 ? highlight : undefined }
      : {
          'data-invalid-syntax': 'table',
          'data-invalid-type': 'highlight',
          'data-invalid-description': `Too much highlight level`,
        },
  };
}

function format(rows: Data<RowParser>[]): HTMLTableSectionElement[] {
  const thead = html('thead');
  const tbody = html('tbody');
  const tfoot = html('tfoot');
  const aligns: ('center' | 'start' | 'end' | '')[] = [];
  const valigns: ('middle' | 'top' | 'bottom' | '')[] = [];
  let target = thead;
  let ranges: Record<number, Record<number, HTMLTableCellElement>> = {};
  let verticalHighlights = 0;
  ROW:
  for (let i = 0; i < rows.length; ++i) {
    // Copy to make them retryable.
    const [[[...as], [...vs] = []], ...cells] = rows[i];
    assert(as !== rows[i][0]?.[0]);
    assert(vs !== rows[i][0]?.[1]);
    assert(cells !== rows[i]);
    let isBody = [
      as[0] === '#' && !!as.shift(),
      vs[0] === '#' && !!vs.shift(),
    ].reduce((a, b) => a || b)
      ? false
      : target === tfoot
        ? false
        : undefined;
    as.length === 0 && as.push('-');
    for (let j = 0; j < as.length; ++j) {
      switch (as[j]) {
        case '=':
          aligns[j] = 'center';
          continue;
        case '<':
          aligns[j] = 'start';
          continue;
        case '>':
          aligns[j] = 'end';
          continue;
        case '-':
          aligns[j] = j === 0
            ? aligns[j] ?? ''
            : aligns[j] ?? aligns[j - 1];
          continue;
      }
      assert(false);
    }
    assert(aligns.length > 0);
    vs.length === 0 && vs.push('-');
    for (let j = 0; j < vs.length; ++j) {
      switch (vs[j]) {
        case '=':
          valigns[j] = 'middle';
          continue;
        case '^':
          valigns[j] = 'top';
          continue;
        case 'v':
          valigns[j] = 'bottom';
          continue;
        case '-':
          valigns[j] = j === 0
            ? valigns[j] ?? ''
            : valigns[j] ?? valigns[j - 1];
          continue;
      }
      assert(false);
    }
    assert(valigns.length > 0);
    const row = html('tr');
    let heads = 0;
    let highlights = 0;
    let hasDataCell = false;
    let lHeadCellIdx: number | undefined;
    let rHeadCellIdx: number | undefined;
    for (let j = 0; j < cells.length && cells.length <= 32; ++j) {
      const isVirtual = !!ranges[i]?.[j];
      const cell = isVirtual
        ? splice(cells, j, 0, undefined) && ranges[i][j]
        : cells[j];
      const isHeadCell = cell.tagName === 'TH';
      heads |= +isHeadCell << j;
      highlights |= +!!cell.classList.contains('highlight') << j;
      hasDataCell ||= !isHeadCell;
      if (isHeadCell && !hasDataCell) {
        lHeadCellIdx = j;
      }
      if (isHeadCell && hasDataCell) {
        rHeadCellIdx ??= j;
      }
      const rowSpan = cell.rowSpan;
      assert(rowSpan > 0);
      if (rowSpan > 1 && !isVirtual) {
        const virtual = cell.cloneNode();
        for (let k = i + 1; k < i + rowSpan && k < rows.length; ++k) {
          ranges[k] ??= [];
          ranges[k][j] = virtual;
        }
      }
      const colSpan = cell.colSpan;
      assert(colSpan > 0);
      if (colSpan > 1) {
        splice(cells, j + 1, 0, ...Array(colSpan - 1));
        heads |= +`0b${`${heads & 1 << j && 1}`.repeat(colSpan)}` << j;
        highlights |= +`0b${`${highlights & 1 << j && 1}`.repeat(colSpan)}` << j;
        j += colSpan - 1;
      }
      if (target === thead) {
        if (!isHeadCell && isBody !== false) {
          isBody = true;
          target = tbody;
          ranges = {};
          --i;
          continue ROW;
        }
      }
      if (target === tbody) {
        if (!isHeadCell && isBody !== false) {
          isBody = true;
        }
        if (j + 1 === cells.length && isBody !== true) {
          isBody = false;
          target = tfoot;
          ranges = {};
          --i;
          continue ROW;
        }
      }
      if (target === tfoot) {
        assert(isBody === false);
      }
      j === aligns.length && aligns.push(aligns[j - 1]);
      j === valigns.length && valigns.push(valigns[j - 1]);
      if (isVirtual) continue;
      row.appendChild(cell);
      aligns[j] && cell.setAttribute('align', aligns[j]);
      valigns[j] && cell.setAttribute('valign', valigns[j]);
    }
    if (cells.length > 32) throw new Error('Number of columns must be 32 or less.');
    target.appendChild(row);
    switch (target) {
      case thead:
        verticalHighlights = heads & highlights;
        continue;
      case tbody:
        lHeadCellIdx ??= -1;
        rHeadCellIdx ??= -1;
        const tHighlights = verticalHighlights;
        const horizontalHighlights = heads & highlights;
        const lHighlight = ~lHeadCellIdx && horizontalHighlights & 1 << lHeadCellIdx;
        const rHighlight = ~rHeadCellIdx && horizontalHighlights & 1 << rHeadCellIdx;
        for (let i = 0, m = 1; i < cells.length; ++i, m <<= 1) {
          const cell = cells[i];
          if (!cell) continue;
          if (heads & m) continue;
          assert(cell.tagName === 'TD');
          if (!(lHighlight || rHighlight || tHighlights & m || highlights & m)) continue;
          cell.classList.add('highlight');
          assert(!+cell.setAttribute('highlight', [
            '',
            'c',
            'h',
            'h c',
            'v',
            'v c',
            'v h',
            'v h c',
          ][+!!(highlights & m) + +!!(lHighlight | rHighlight) * 2 + +!!(tHighlights & m) * 4]));
        }
        continue;
      case tfoot:
        continue;
    }
    assert(false);
  }
  return [
    thead,
    tbody,
    tfoot,
  ];
}
