import { table } from './table';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/table', () => {
  describe('table', () => {
    const parser = some(table);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|')), undefined);
      assert.deepStrictEqual(inspect(parser, input('||')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|||')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|\n|')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|\n|\n|')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|h')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|h')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|h\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|h\n|')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|h\n|b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|h\n|-\nb')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|h\n|-\n |b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|h\n |-\n|b')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' |h\n|-\n|b')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('|\n|-\n|')), [['<table><thead><tr></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('||\n|-|\n||')), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|||\n|-|-|\n|||')), [['<table><thead><tr><th></th><th></th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|"|\n|-\n|')), [['<table><thead><tr><th>"</th></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|`|`|\n|-\n|')), [['<table><thead><tr><th><code data-src="`|`">|</code></th></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|((|\n|-\n|')), [['<table><thead><tr><th><span class="paren">(<span class="paren">(</span></span></th></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|a|b|\n|-|-|\n|1|2|')), [['<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|a|b\n|-|-\n|1|2')), [['<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|a|\n|-|\n|1|')), [['<table><thead><tr><th>a</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|a\n|-\n|1')), [['<table><thead><tr><th>a</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('||\n|-\n||')), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('||\n|-\n||\\')), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('||\n|-\n||\\ ')), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('||\n|-\n||\\\n')), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('||\n|-\n||\\\n||')), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td><td></td></tr><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|| \n|- \n|| ')), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|| \n|-| \n|| ')), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
    });

    it('align', () => {
      assert.deepStrictEqual(inspect(parser, input('|h|\n|:-|\n|b|')), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td align="start">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|h|\n|-:|\n|b|')), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td align="end">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|h|\n|:-:|\n|b|')), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td align="center">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|h|h|\n|:-|-|\n|b|b|')), [['<table><thead><tr><th>h</th><th>h</th></tr></thead><tbody><tr><td align="start">b</td><td align="start">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|h|h|\n|:-|:-|\n|b|b|')), [['<table><thead><tr><th>h</th><th>h</th></tr></thead><tbody><tr><td align="start">b</td><td align="start">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|h|h|\n|:-|:-:|\n|b|b|')), [['<table><thead><tr><th>h</th><th>h</th></tr></thead><tbody><tr><td align="start">b</td><td align="center">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|h|h|\n|:-|-:|\n|b|b|')), [['<table><thead><tr><th>h</th><th>h</th></tr></thead><tbody><tr><td align="start">b</td><td align="end">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|h|h|h|\n|:-:|:-|-:|\n|b|b|b|')), [['<table><thead><tr><th>h</th><th>h</th><th>h</th></tr></thead><tbody><tr><td align="center">b</td><td align="start">b</td><td align="end">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|h|h|\n|:-|\n|b|b|')), [['<table><thead><tr><th>h</th><th>h</th></tr></thead><tbody><tr><td align="start">b</td><td align="start">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|h|h|\n|:-|-|\n|b|b|')), [['<table><thead><tr><th>h</th><th>h</th></tr></thead><tbody><tr><td align="start">b</td><td align="start">b</td></tr></tbody></table>'], '']);
    });

    it('trim', () => {
      assert.deepStrictEqual(inspect(parser, input('|  h  \n|- \n|  b  ')), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|  h  | \n|- \n|  b  | ')), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|\\  h  \\\n|- \n|\\  b  \\')), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|\\  h  \\ \n|- \n|\\  b  \\ | ')), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table>'], '']);
    });

  });

});
