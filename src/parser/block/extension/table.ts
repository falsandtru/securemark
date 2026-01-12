import { max, min, isArray } from 'spica/alias';
import { ExtensionParser } from '../../block';
import { Tree, eval } from '../../../combinator/data/parser';
import { union, subsequence, inits, some, block, line, validate, fence, rewrite, surround, open, clear, convert, dup, lazy, fmap } from '../../../combinator';
import { inline, medialink, media, shortmedia } from '../../inline';
import { str, anyline, emptyline, contentline } from '../../source';
import { lineable } from '../../util';
import { visualize, trimBlank, trimBlankEnd } from '../../visibility';
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

const delimiter = /^[-=<>]+(?:\/[-=^v]*)?(?=[^\S\n]*\n)|^[#:](?:(?!:\D|0)\d*:(?!0)\d*)?(?:!+[+]?)?(?=\s)/;

const head: CellParser.HeadParser = block(fmap(open(
  str(/^#(?:(?!:\D|0)\d*:(?!0)\d*)?(?:!+[+]?)?(?=\s)/),
  rewrite(
    inits([
      anyline,
      some(contentline, delimiter),
    ]),
    union([
      block(surround(/^[^\n]/, medialink, /^\s*$/)),
      block(surround(/^[^\n]/, media, /^\s*$/)),
      block(surround(/^[^\n]/, shortmedia, /^\s*$/)),
      open(/^(?:\s*\n|\s)/, visualize(trimBlank(some(inline))), true),
    ])),
  true),
  ns => [html('th', attributes(ns.shift()! as string), defrag(ns))]),
  false);

const data: CellParser.DataParser = block(fmap(open(
  str(/^:(?:(?!:\D|0)\d*:(?!0)\d*)?(?:!+[+]?)?(?=\s)/),
  rewrite(
    inits([
      anyline,
      some(contentline, delimiter),
    ]),
    union([
      block(surround(/^[^\n]/, medialink, /^\s*$/)),
      block(surround(/^[^\n]/, media, /^\s*$/)),
      block(surround(/^[^\n]/, shortmedia, /^\s*$/)),
      open(/^(?:\s*\n|\s)/, visualize(trimBlankEnd(lineable(some(inline)))), true),
    ])),
  true),
  ns => [html('td', attributes(ns.shift()! as string), defrag(ns))]),
  false);

const dataline: CellParser.DatalineParser = line(
  rewrite(
    contentline,
    union([
      validate(/^!+\s/, convert(source => `:${source}`, data)),
      convert(source => `: ${source}`, data),
    ])));

function attributes(source: string): Record<string, string | undefined> {
  let [, rowspan = undefined, colspan = undefined, highlight = undefined, extension = undefined] =
    source.match(/^[#:](?:(\d+)?:(\d+)?)?(?:(!+)([+]?))?$/) ?? [];
  assert(rowspan?.[0] !== '0');
  assert(colspan?.[0] !== '0');
  rowspan === '1' ? rowspan = undefined : undefined;
  colspan === '1' ? colspan = undefined : undefined;
  rowspan &&= `${max(0, min(+rowspan, 65534))}`;
  colspan &&= `${max(0, min(+colspan, 1000))}`;
  extension ||= undefined;
  const level = highlight?.length ?? 0;
  const validH = !highlight
    || source[0] === '#' && level <= 6
    || source[0] === ':' && level <= 6;
  const validE = source[0] === '#' || extension !== '+';
  const valid = validH && validE;
  return {
    class: valid ? highlight && 'highlight' : 'invalid',
    rowspan,
    colspan,
    ...
    !validH && {
      'data-invalid-syntax': 'table',
      'data-invalid-type': 'syntax',
      'data-invalid-message': 'Too much highlight level',
    } ||
    !validE && {
      'data-invalid-syntax': 'table',
      'data-invalid-type': 'syntax',
      'data-invalid-message': 'Extensible cells are only head cells',
    } ||
    {
      'data-highlight-level': level > 1 ? `${level}` : undefined,
      'data-highlight-extension': extension,
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
  let verticalHighlightExtensions = 0n;
  let verticalHighlightLevels: string[] = [];
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
    let highlightExtensions = 0n;
    let highlightLevels: string[] = [];
    let hasDataCell = false;
    let lHeadCellIndex: bigint;
    let rHeadCellIndex: bigint;
    for (let j = 0; j < cells.length; ++j) {
      const jn = BigInt(j);
      const isVirtual = !!ranges[i]?.[j];
      const cell = isVirtual
        ? splice(cells, j, 0, undefined) && ranges[i][j]
        : cells[j];
      const isHeadCell = cell.tagName === 'TH';
      heads |= isHeadCell ? 1n << jn : 0n;
      highlights |= cell.className === 'highlight' ? 1n << jn : 0n;
      highlightExtensions |= cell.getAttribute('data-highlight-extension') ? 1n << jn : 0n;
      highlightLevels[j] = cell.getAttribute('data-highlight-level') ?? '1';
      hasDataCell ||= !isHeadCell;
      if (isHeadCell && !hasDataCell) {
        lHeadCellIndex = jn;
      }
      if (isHeadCell && hasDataCell) {
        rHeadCellIndex ??= jn;
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
        highlightExtensions |= highlightExtensions & 1n << jn && ~(~0n << BigInt(colSpan)) << jn;
        splice(highlightLevels, j + 1, 0, ...Array(colSpan - 1));
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
        verticalHighlightExtensions = highlightExtensions;
        verticalHighlightLevels = highlightLevels;
        continue;
      case tbody:
        lHeadCellIndex ??= -1n;
        rHeadCellIndex ??= -1n;
        const tHighlights = verticalHighlightExtensions;
        const horizontalHighlights = highlightExtensions;
        const horizontalHighlightLevels = highlightLevels;
        const lHighlight = ~lHeadCellIndex && horizontalHighlights & 1n << lHeadCellIndex;
        const rHighlight = ~rHeadCellIndex && horizontalHighlights & 1n << rHeadCellIndex;
        for (let i = 0, m = 1n; i < cells.length; ++i, m <<= 1n) {
          const cell = cells[i];
          if (!cell) continue;
          if (heads & m) continue;
          assert(cell.tagName === 'TD');
          switch (m) {
            case highlights & m:
              assert(cell.className === 'highlight');
              assert(horizontalHighlightLevels[i]);
              (lHighlight || rHighlight) && cell.setAttribute('data-highlight-level', horizontalHighlightLevels[i]);
              break;
            case lHighlight && m:
            case rHighlight && m:
              cell.classList.add('highlight');
              break;
            case tHighlights & m:
              cell.classList.add('highlight');
              +verticalHighlightLevels[i] > 1 && cell.setAttribute('data-highlight-level', verticalHighlightLevels[i]);
              break;
            default:
              continue;
          }
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
