import { max, min, isArray } from 'spica/alias';
import { ExtensionParser } from '../../block';
import { Tree, eval } from '../../../combinator/data/parser';
import { union, subsequence, inits, some, creation, block, line, validate, fence, rewrite, open, clear, convert, trim, dup, lazy, fmap } from '../../../combinator';
import { inline } from '../../inline';
import { str, anyline, emptyline, contentline } from '../../source';
import { visualize } from '../../visibility';
import { unshift, splice } from 'spica/array';
import { html, define, defrag } from 'typed-dom/dom';

import TableParser = ExtensionParser.TableParser;
import RowParser = TableParser.RowParser;
import AlignParser = TableParser.AlignParser;
import CellParser = TableParser.CellParser;

const opener = /^(~{3,})table(?:\/(\S+))?(?!\S)([^\n]*)(?:$|\n)/;

export const segment: TableParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 10000))));

export const segment_: TableParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 10000, false))), false);

export const table: TableParser = block(validate('~~~', fmap(
  fence(opener, 10000),
  // Bug: Type mismatch between outer and inner.
  ([body, overflow, closer, opener, delim, type, param]: string[], _, context) => {
    if (!closer || overflow || param.trimStart()) return [html('pre', {
      class: 'invalid',
      translate: 'no',
      'data-invalid-syntax': 'table',
      'data-invalid-type': !closer || overflow ? 'fence' : 'argument',
      'data-invalid-message':
        !closer ? `Missing the closing delimiter "${delim}"` :
        overflow ?  `Invalid trailing line after the closing delimiter "${delim}"` :
        'Invalid argument',
    }, `${opener}${body}${overflow || closer}`)];
    switch (type) {
      case 'grid':
      case undefined:
        return (eval(parser({ source: body, context })) ?? [html('table')])
          .map(el => define(el, { 'data-type': type }));
      default:
        return [html('pre', {
          class: 'invalid',
          translate: 'no',
          'data-invalid-syntax': 'table',
          'data-invalid-type': 'argument',
          'data-invalid-message': 'Invalid table type',
        }, `${opener}${body}${closer}`)];
    }
  })));

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
      some(dataline, alignment),
      emptyline,
    ])),
  ]),
  ns => !isArray(ns[0]) ? unshift([[[]]], ns) : ns)));

const alignment = /^[-=<>]+(?:\/[-=^v]*)?(?=[^\S\n]*\n)/;

const align: AlignParser = line(fmap(
  union([str(alignment)]),
  ([s]) => s.split('/').map(s => s.split(''))));

const delimiter = /^[-=<>]+(?:\/[-=^v]*)?(?=[^\S\n]*\n)|^[#:](?:(?!:\D|0)\d*:(?!0)\d*)?!*(?=\s)/;

const head: CellParser.HeadParser = creation(1, false, block(fmap(open(
  str(/^#(?:(?!:\D|0)\d*:(?!0)\d*)?!*(?=\s)/),
  rewrite(
    inits([
      anyline,
      some(contentline, delimiter),
    ]),
    trim(visualize(some(union([inline]))))),
  true),
  ns => [html('th', attributes(ns.shift()! as string), defrag(ns))]),
  false));

const data: CellParser.DataParser = creation(1, false, block(fmap(open(
  str(/^:(?:(?!:\D|0)\d*:(?!0)\d*)?!*(?=\s)/),
  rewrite(
    inits([
      anyline,
      some(contentline, delimiter),
    ]),
    trim(visualize(some(union([inline]))))),
  true),
  ns => [html('td', attributes(ns.shift()! as string), defrag(ns))]),
  false));

const dataline: CellParser.DatalineParser = creation(1, false, line(
  rewrite(
    contentline,
    union([
      validate(/^!+\s/, convert(source => `:${source}`, data)),
      convert(source => `: ${source}`, data),
    ]))));

function attributes(source: string) {
  let [, rowspan = undefined, colspan = undefined, highlight = undefined] = source.match(/^[#:](?:(\d+)?:(\d+)?)?(!+)?$/) ?? [];
  assert(rowspan?.[0] !== '0');
  assert(colspan?.[0] !== '0');
  rowspan === '1' ? rowspan = undefined : undefined;
  colspan === '1' ? colspan = undefined : undefined;
  rowspan &&= `${max(0, min(+rowspan, 65534))}`;
  colspan &&= `${max(0, min(+colspan, 1000))}`;
  const level = highlight?.length ?? 0;
  const valid = !highlight
    || source[0] === '#' && level <= 1
    || source[0] === ':' && level <= 6;
  return {
    class: valid ? highlight && 'highlight' : 'invalid',
    rowspan,
    colspan,
    ...valid
      ? { 'data-highlight-level': level > 1 ? `${level}` : undefined }
      : {
          'data-invalid-syntax': 'table',
          'data-invalid-type': 'syntax',
          'data-invalid-message': 'Too much highlight level',
        },
  };
}

function format(rows: Tree<RowParser>[]): HTMLTableSectionElement[] {
  const thead = html('thead');
  const tbody = html('tbody');
  const tfoot = html('tfoot');
  const aligns: ('center' | 'start' | 'end' | '')[] = [];
  const valigns: ('middle' | 'top' | 'bottom' | '')[] = [];
  let target = thead;
  let ranges: Record<number, Record<number, HTMLTableCellElement>> = {};
  let verticalHighlights = 0n;
  ROW:
  for (let i = 0; i < rows.length; ++i) {
    // Copy to make them retryable.
    const [[[...as], [...vs] = []], ...cells] = rows[i];
    assert(as !== rows[i][0]?.[0]);
    assert(vs !== rows[i][0]?.[1]);
    assert(cells !== rows[i]);
    let isBody = target === tfoot
      ? false
      : undefined;
    as.length === 0 && as.push('-');
    ALIGN_H:
    for (let j = 0, update = false; j < as.length || j < aligns.length; ++j) {
      switch (as[j]) {
        case '=':
          update = true;
          aligns[j] = 'center';
          continue;
        case '<':
          update = true;
          aligns[j] = 'start';
          continue;
        case '>':
          update = true;
          aligns[j] = 'end';
          continue;
        case '-':
          update = false;
          aligns[j] ??= j === 0
            ? ''
            : aligns[j - 1];
          continue;
        default:
          if (!update) break ALIGN_H;
          aligns[j] = aligns[j - 1];
          continue;
      }
    }
    assert(aligns.length > 0);
    vs.length === 0 && vs.push('-');
    ALIGN_V:
    for (let j = 0, update = false; j < vs.length || j < valigns.length; ++j) {
      switch (vs[j]) {
        case '=':
          update = true;
          valigns[j] = 'middle';
          continue;
        case '^':
          update = true;
          valigns[j] = 'top';
          continue;
        case 'v':
          update = true;
          valigns[j] = 'bottom';
          continue;
        case '-':
          update = false;
          valigns[j] ??= j === 0
            ? ''
            : valigns[j - 1];
          continue;
        default:
          if (!update) break ALIGN_V;
          aligns[j] = aligns[j - 1];
          continue;
      }
    }
    assert(valigns.length > 0);
    const row = html('tr');
    let heads = 0n;
    let highlights = 0n;
    let hasDataCell = false;
    let lHeadCellIdx: bigint;
    let rHeadCellIdx: bigint;
    for (let j = 0; j < cells.length; ++j) {
      const jn = BigInt(j);
      const isVirtual = !!ranges[i]?.[j];
      const cell = isVirtual
        ? splice(cells, j, 0, undefined) && ranges[i][j]
        : cells[j];
      const isHeadCell = cell.tagName === 'TH';
      heads |= isHeadCell ? 1n << jn : 0n;
      highlights |= cell.className === 'highlight' ? 1n << jn : 0n;
      hasDataCell ||= !isHeadCell;
      if (isHeadCell && !hasDataCell) {
        lHeadCellIdx = jn;
      }
      if (isHeadCell && hasDataCell) {
        rHeadCellIdx ??= jn;
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
        heads |= heads & 1n << jn && ~(~0n << BigInt(colSpan)) << jn;
        highlights |= highlights & 1n << jn && ~(~0n << BigInt(colSpan)) << jn;
        j += colSpan - 1;
      }
      if (target === thead) {
        if (!isHeadCell && isBody !== false || isBody) {
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
    target.appendChild(row);
    switch (target) {
      case thead:
        verticalHighlights = heads & highlights;
        continue;
      case tbody:
        lHeadCellIdx ??= -1n;
        rHeadCellIdx ??= -1n;
        const tHighlights = verticalHighlights;
        const horizontalHighlights = heads & highlights;
        const lHighlight = ~lHeadCellIdx && horizontalHighlights & 1n << lHeadCellIdx;
        const rHighlight = ~rHeadCellIdx && horizontalHighlights & 1n << rHeadCellIdx;
        for (let i = 0, m = 1n; i < cells.length; ++i, m <<= 1n) {
          const cell = cells[i];
          if (!cell) continue;
          if (heads & m) continue;
          assert(cell.tagName === 'TD');
          //if (!(lHighlight || rHighlight || tHighlights & m || highlights & m)) continue;
          if (!(tHighlights & m || highlights & m)) continue;
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
          ][+!!(highlights & m) | +!!(lHighlight | rHighlight) << 1 | +!!(tHighlights & m) << 2]));
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
