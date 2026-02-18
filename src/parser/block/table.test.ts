import { table } from './table';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/table', () => {
  describe('table', () => {
    const parser = (source: string) => some(table)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('||'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|||'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|\n|'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|h'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|h'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|h\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|h\n|'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|h\n|b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|h\n|-\nb'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|h\n|-\n |b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|h\n |-\n|b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' |h\n|-\n|b'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('|\n|\n|'), ctx), [['<table><thead><tr></tr></thead><tbody><tr class="invalid"><td>|</td></tr><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|\n|-\n|'), ctx), [['<table><thead><tr></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('||\n|-|\n||'), ctx), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|||\n|-|-|\n|||'), ctx), [['<table><thead><tr><th></th><th></th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|"|\n|-\n|'), ctx), [['<table><thead><tr><th>"</th></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|`|`|\n|-\n|'), ctx), [['<table><thead><tr><th><code data-src="`|`">|</code></th></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|((|\n|-\n|'), ctx), [['<table><thead><tr><th>((</th></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|${|\n|-\n|'), ctx), [['<table><thead><tr><th>${</th></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-|-|\n|1|2|'), ctx), [['<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b\n|-|-\n|1|2'), ctx), [['<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|\n|-|\n|1|'), ctx), [['<table><thead><tr><th>a</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a\n|-\n|1'), ctx), [['<table><thead><tr><th>a</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('||\n|-\n||'), ctx), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('||\n|-\n||\\'), ctx), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('||\n|-\n||\\ '), ctx), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('||\n|-\n||\\\n'), ctx), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('||\n|-\n||\\\n||'), ctx), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td><td></td></tr><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|| \n|- \n|| '), ctx), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|| \n|-| \n|| '), ctx), [['<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
    });

    it('align', () => {
      assert.deepStrictEqual(inspect(parser('|h|\n|:-|\n|b|'), ctx), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td align="start">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-:|\n|b|'), ctx), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td align="end">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|:-:|\n|b|'), ctx), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td align="center">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|-|\n|b|b|'), ctx), [['<table><thead><tr><th>h</th><th>h</th></tr></thead><tbody><tr><td align="start">b</td><td align="start">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|:-|\n|b|b|'), ctx), [['<table><thead><tr><th>h</th><th>h</th></tr></thead><tbody><tr><td align="start">b</td><td align="start">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|:-:|\n|b|b|'), ctx), [['<table><thead><tr><th>h</th><th>h</th></tr></thead><tbody><tr><td align="start">b</td><td align="center">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|-:|\n|b|b|'), ctx), [['<table><thead><tr><th>h</th><th>h</th></tr></thead><tbody><tr><td align="start">b</td><td align="end">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|h|\n|:-:|:-|-:|\n|b|b|b|'), ctx), [['<table><thead><tr><th>h</th><th>h</th><th>h</th></tr></thead><tbody><tr><td align="center">b</td><td align="start">b</td><td align="end">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|\n|b|b|'), ctx), [['<table><thead><tr><th>h</th><th>h</th></tr></thead><tbody><tr><td align="start">b</td><td align="start">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|-|\n|b|b|'), ctx), [['<table><thead><tr><th>h</th><th>h</th></tr></thead><tbody><tr><td align="start">b</td><td align="start">b</td></tr></tbody></table>'], '']);
    });

    it('trim', () => {
      assert.deepStrictEqual(inspect(parser('|  h  \n|- \n|  b  '), ctx), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|  h  | \n|- \n|  b  | '), ctx), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|\\  h  \\\n|- \n|\\  b  \\'), ctx), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|\\  h  \\ \n|- \n|\\  b  \\ | '), ctx), [['<table><thead><tr><th>h</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table>'], '']);
    });

  });

});
