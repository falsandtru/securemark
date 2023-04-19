import { table } from './table';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';
import { html } from 'typed-dom/dom';

describe('Unit: parser/block/extension/table', () => {
  describe('table', () => {
    const parser = (source: string) => some(table)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~table a\n-\n~~~')), [['<pre class="invalid" translate="no">~~~table a\n-\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(`~~~table\n0${'\n'.repeat(10001)}~~~`), '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('data', () => {
      assert.deepStrictEqual(
        inspect(parser('~~~table\n~~~')),
        [[html('table').outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n\n~~~\n')),
        [[html('table', [html('thead', [html('tr')]), html('tbody'), html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-\n~~~')),
        [[html('table', [html('thead', [html('tr')]), html('tbody'), html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-\n\n~~~')),
        [[html('table', [html('thead', [html('tr')]), html('tbody'), html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n0\n\n~~~')),
        [[html('table', [html('thead'), html('tbody', [html('tr', [html('td', '0')])]), html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n:\n~~~')),
        [[html('table', [html('thead'), html('tbody', [html('tr', [html('td')])]), html('tfoot'),]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n1.1\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', '1.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n1.1\n1.2\n\n1.3\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', '1.1'), html('td', '1.2'), html('td', '1.3')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n1.1\n-\n2.1\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', '1.1')]),
            html('tr', [html('td', '2.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n: 1.1\n0\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', ['1.1', html('br'), '0'])]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n: 1.1\n: 1.2\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', '1.1'), html('td', '1.2')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n: 1.1\n\n1.2\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', '1.1'), html('td', '1.2')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n1.1\n: 1.2\n:1:1 1.3\n\n: 1.4\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', '1.1'), html('td', ': 1.2'), html('td', ':1:1 1.3'), html('td', '1.4')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n\\ \n\\ \n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', '\\'), html('td', '\\')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n: \\ \n\\ \n0\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', ['\\', html('br'), '\\', html('br'), '0'])]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
    });

    it('align', () => {
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-=<>\n~~~')),
        [[html('table', [html('thead', [html('tr')]), html('tbody'), html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-=<>/-=^v\n~~~')),
        [[html('table', [html('thead', [html('tr')]), html('tbody'), html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-/-=^v\n~~~')),
        [[html('table', [html('thead', [html('tr')]), html('tbody'), html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-=^v\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', '-=^v')]),
          ]),
          html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n=-<>\n1.1\n1.2\n1.3\n1.4\n1.5\n1.6\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [
              html('td', { align: 'center' }, '1.1'),
              html('td', { align: 'center' }, '1.2'),
              html('td', { align: 'start' }, '1.3'),
              html('td', { align: 'end' }, '1.4'),
              html('td', { align: 'end' }, '1.5'),
              html('td', { align: 'end' }, '1.6'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n=<\n-\n2.1\n2.2\n2.3\n~~~')),
        [[html('table', [
          html('thead', [html('tr')]),
          html('tbody', [
            html('tr', [
              html('td', { align: 'center' }, '2.1'),
              html('td', { align: 'start' }, '2.2'),
              html('td', { align: 'start' }, '2.3'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n=<\n=\n2.1\n2.2\n2.3\n~~~')),
        [[html('table', [
          html('thead', [html('tr')]),
          html('tbody', [
            html('tr', [
              html('td', { align: 'center' }, '2.1'),
              html('td', { align: 'center' }, '2.2'),
              html('td', { align: 'center' }, '2.3'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n=<\n=-\n2.1\n2.2\n2.3\n~~~')),
        [[html('table', [
          html('thead', [html('tr')]),
          html('tbody', [
            html('tr', [
              html('td', { align: 'center' }, '2.1'),
              html('td', { align: 'start' }, '2.2'),
              html('td', { align: 'start' }, '2.3'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-/=-^v\n1.1\n1.2\n1.3\n1.4\n1.5\n1.6\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [
              html('td', { valign: 'middle' }, '1.1'),
              html('td', { valign: 'middle' }, '1.2'),
              html('td', { valign: 'top' }, '1.3'),
              html('td', { valign: 'bottom' }, '1.4'),
              html('td', { valign: 'bottom' }, '1.5'),
              html('td', { valign: 'bottom' }, '1.6'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-/=^\n-/-\n2.1\n2.2\n2.3\n~~~')),
        [[html('table', [
          html('thead', [html('tr')]),
          html('tbody', [
            html('tr', [
              html('td', { valign: 'middle' }, '2.1'),
              html('td', { valign: 'top' }, '2.2'),
              html('td', { valign: 'top' }, '2.3'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
    });

    it('head', () => {
      assert.deepStrictEqual(
        inspect(parser('~~~table\n#\n~~~')),
        [[html('table', [html('thead', [html('tr', [html('th')])]), html('tbody'), html('tfoot'),]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-\n# 1.1\n~~~')),
        [[html('table', [
          html('thead', [
            html('tr', [html('th', '1.1')]),
          ]),
          html('tbody'),
          html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-/-\n# 1.1\n~~~')),
        [[html('table', [
          html('thead', [
            html('tr', [html('th', '1.1')]),
          ]),
          html('tbody'),
          html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n# 1.1\n~~~')),
        [[html('table', [
          html('thead', [
            html('tr', [html('th', '1.1')]),
          ]),
          html('tbody'),
          html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n# 1.1\n: 1.2\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('th', '1.1'), html('td', '1.2')]),
          ]),
          html('tfoot')]).outerHTML], '']);
    });

    it('foot', () => {
      assert.deepStrictEqual(
        inspect(parser('~~~table\n1.1\n-\n# 2.1\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', '1.1')]),
          ]),
          html('tfoot', [
            html('tr', [html('th', '2.1')]),
          ])]).outerHTML], '']);
    });

    it('highlight', () => {
      assert.deepStrictEqual(
        inspect(parser('~~~table\n#! 1.1\n~~~')),
        [[html('table', [
          html('thead', [
            html('tr', [html('th', { class: 'highlight' }, '1.1')]),
          ]),
          html('tbody'),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n:! 1.1\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', { class: 'highlight', highlight: 'c' }, '1.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n#! 1.1\n: 1.2\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [
              html('th', { class: 'highlight' }, '1.1'),
              html('td', '1.2'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n: 1.1\n#! 1.2\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [
              html('td', '1.1'),
              html('th', { class: 'highlight' }, '1.2'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n#! 1.1\n-\n: 2.1\n~~~')),
        [[html('table', [
          html('thead', [
            html('tr', [html('th', { class: 'highlight' }, '1.1')]),
          ]),
          html('tbody', [
            html('tr', [html('td', { class: 'highlight', highlight: 'v' }, '2.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n#! 1.1\n# 1.2\n: 1.3\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [
              html('th', { class: 'highlight' }, '1.1'),
              html('th', '1.2'),
              html('td', '1.3'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n: 1.1\n# 1.2\n#! 1.3\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [
              html('td', '1.1'),
              html('th', '1.2'),
              html('th', { class: 'highlight' }, '1.3'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n#! 1.1\n-\n# 2.1\n-\n: 3.1\n~~~')),
        [[html('table', [
          html('thead', [
            html('tr', [html('th', { class: 'highlight' }, '1.1')]),
            html('tr', [html('th', '2.1')]),
          ]),
          html('tbody', [
            html('tr', [html('td', '3.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n#:2! 1.1\n: 1.3\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [
              html('th', { class: 'highlight', colspan: '2' }, '1.1'),
              html('td', '1.3'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n#2:! 1.1\n-\n: 3.1\n~~~')),
        [[html('table', [
          html('thead', [
            html('tr', [html('th', { class: 'highlight', rowspan: '2' }, '1.1')]),
          ]),
          html('tbody', [
            html('tr', [html('td', { class: 'highlight', highlight: 'v' }, '3.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-\n# \n#! 1.2\n-\n#! 2.1\n: 2.2\n~~~')),
        [[html('table', [
          html('thead', [
            html('tr', [
              html('th'),
              html('th', { class: 'highlight' }, '1.2'),
            ]),
          ]),
          html('tbody', [
            html('tr', [
              html('th', { class: 'highlight' }, '2.1'),
              html('td', { class: 'highlight', highlight: 'v h' }, '2.2'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-\n# \n#! 1.2\n-\n#! 2.1\n:! 2.2\n~~~')),
        [[html('table', [
          html('thead', [
            html('tr', [
              html('th'),
              html('th', { class: 'highlight' }, '1.2'),
            ]),
          ]),
          html('tbody', [
            html('tr', [
              html('th', { class: 'highlight' }, '2.1'),
              html('td', { class: 'highlight', highlight: 'v h c' }, '2.2'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-\n# 1.1\n#! 1.2\n-\n# 2.1\n:2:2 2.2\n: 2.4\n-\n#! 3.1\n: 3.4\n-\n# 4.1\n: 4.2\n~~~')),
        [[html('table', [
          html('thead', [
            html('tr', [
              html('th', '1.1'),
              html('th', { class: 'highlight' }, '1.2'),
            ]),
          ]),
          html('tbody', [
            html('tr', [
              html('th', '2.1'),
              html('td', { rowspan: '2', colspan: '2', class: 'highlight', highlight: 'v' }, '2.2'),
              html('td', '2.4'),
            ]),
            html('tr', [
              html('th', { class: 'highlight' }, '3.1'),
              html('td', '3.4'),
            ]),
            html('tr', [
              html('th', '4.1'),
              html('td', { class: 'highlight', highlight: 'v' }, '4.2'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n-\n# 1.1\n#:2! 1.2\n-\n#2:! 2.1\n: 2.2\n-\n3.2\n3.3\n~~~')),
        [[html('table', [
          html('thead', [
            html('tr', [
              html('th', '1.1'),
              html('th', { class: 'highlight', colspan: '2' }, '1.2'),
            ]),
          ]),
          html('tbody', [
            html('tr', [
              html('th', { class: 'highlight', rowspan: '2' }, '2.1'),
              html('td', { class: 'highlight', highlight: 'v h' }, '2.2'),
            ]),
            html('tr', [
              html('td', { class: 'highlight', highlight: 'v h' }, '3.2'),
              html('td', { class: 'highlight', highlight: 'v h' }, '3.3'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser([
          '~~~table',
          `-\n#  1\n${[...Array(32)].map((_, i) => `: ${i + 2}`).join('\n')}`,
          `-\n#! 1\n${[...Array(32)].map((_, i) => `: ${i + 2}`).join('\n')}`,
          '~~~'
        ].join('\n'))),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [
              html('th', '1'),
              ...[...Array(32)].map((_, i) => html('td', `${i + 2}`)),
            ]),
            html('tr', [
              html('th', { class: 'highlight' }, '1'),
              ...[...Array(32)].map((_, i) => html('td', `${i + 2}`)),
            ]),
          ]),
          html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser([
          '~~~table',
          `-\n${[...Array(32)].map((_, i) => `: ${i + 1}`).join('\n')}\n#  33`,
          `-\n${[...Array(32)].map((_, i) => `: ${i + 1}`).join('\n')}\n#! 33`,
          '~~~'
        ].join('\n'))),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [
              ...[...Array(32)].map((_, i) => html('td', `${i + 1}`)),
              html('th', '33'),
            ]),
            html('tr', [
              ...[...Array(32)].map((_, i) => html('td', `${i + 1}`)),
              html('th', { class: 'highlight' }, '33'),
            ]),
          ]),
          html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser([
          '~~~table',
          `-\n${[...Array(32)].map((_, i) => `# ${i + 1}`).join('\n')}\n#! 33`,
          `-\n${[...Array(33)].map((_, i) => `: ${i + 1}`).join('\n')}`,
          '~~~'
        ].join('\n'))),
        [[html('table', [
          html('thead', [
            html('tr', [
              ...[...Array(32)].map((_, i) => html('th', `${i + 1}`)),
              html('th', { class: 'highlight' }, '33'),
            ]),
          ]),
          html('tbody', [
            html('tr', [
              ...[...Array(32)].map((_, i) => html('td', `${i + 1}`)),
              html('td', { class: 'highlight', highlight: 'v' }, '33'),
            ]),
          ]),
          html('tfoot')]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser([
          '~~~table',
          `${[...Array(7)].map((_, i) => `#${'!'.repeat(i + 1)} ${i + 1}`).join('\n')}`,
          '~~~'
        ].join('\n'))),
        [[html('table', [
          html('thead', [
            html('tr', [
              html('th', { class: 'highlight' }, '1'),
              ...[...Array(6)].map((_, i) => html('th', { class: 'invalid' }, `${i + 2}`)),
            ]),
          ]),
          html('tbody'),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser([
          '~~~table',
          `${[...Array(7)].map((_, i) => `:${'!'.repeat(i + 1)} ${i + 1}`).join('\n')}`,
          '~~~'
        ].join('\n'))),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [
              html('td', { class: 'highlight', highlight: 'c' }, '1'),
              ...[...Array(5)].map((_, i) => html('td', { class: 'highlight', 'data-highlight-level': `${i + 2}`, highlight: 'c' }, `${i + 2}`)),
              html('td', { class: 'invalid' }, '7'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n#! 1\n: 2\n:! 3\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [
              html('th', { class: 'highlight' }, '1'),
              html('td', '2'),
              html('td', { class: 'highlight', highlight: 'h c' }, '3'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n! 1.1\n!!!!!! 1.2\n!!!!!!! 1.3\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [
              html('td', { class: 'highlight', highlight: 'c' }, '1.1'),
              html('td', { class: 'highlight', 'data-highlight-level': '6', highlight: 'c' }, '1.2'),
              html('td', { class: 'invalid' }, '1.3'),
            ]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
    });

    it('merge', () => {
      assert.deepStrictEqual(
        inspect(parser('~~~table\n:: 1.1\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', ':: 1.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n:0:0 1.1\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', ':0:0 1.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n:01:01 1.1\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', ':01:01 1.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n:1:1 1.1\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', '1.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n:2: 1.1\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', { rowspan: '2' }, '1.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n::2 1.1\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', { colspan: '2' }, '1.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table\n:2:3 1.1\n~~~')),
        [[html('table', [
          html('thead'),
          html('tbody', [
            html('tr', [html('td', { rowspan: '2', colspan: '3' }, '1.1')]),
          ]),
          html('tfoot'),
        ]).outerHTML], '']);
    });

    it('type', () => {
      assert.deepStrictEqual(
        inspect(parser('~~~table/invalid\n~~~')),
        [['<pre class="invalid" translate="no">~~~table/invalid\n~~~</pre>'], '']);
      assert.deepStrictEqual(
        inspect(parser('~~~table/grid\n~~~')),
        [[html('table', { 'data-type': 'grid' }).outerHTML], '']);
    });

  });

});
