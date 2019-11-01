import { table } from './table';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/table', () => {
  describe('table', () => {
    const parser = (source: string) => some(table)(source, {}, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('|')), undefined);
      assert.deepStrictEqual(inspect(parser('||')), undefined);
      assert.deepStrictEqual(inspect(parser('|||')), undefined);
      assert.deepStrictEqual(inspect(parser('|\n|')), undefined);
      assert.deepStrictEqual(inspect(parser('|\n|\n|')), undefined);
      assert.deepStrictEqual(inspect(parser('|h')), undefined);
      assert.deepStrictEqual(inspect(parser('|h')), undefined);
      assert.deepStrictEqual(inspect(parser('|h\n')), undefined);
      assert.deepStrictEqual(inspect(parser('|h\n|')), undefined);
      assert.deepStrictEqual(inspect(parser('|h\n|b')), undefined);
      assert.deepStrictEqual(inspect(parser('|h\n|-\nb')), undefined);
      assert.deepStrictEqual(inspect(parser('|h\n|-\n |b')), undefined);
      assert.deepStrictEqual(inspect(parser('|h\n |-\n|b')), undefined);
      assert.deepStrictEqual(inspect(parser(' |h\n|-\n|b')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('|\n|-\n|')), [['<table><thead><tr></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('||\n|-|\n||')), [['<table><thead><tr><td></td></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|||\n|-|-|\n|||')), [['<table><thead><tr><td></td><td></td></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-|-|\n|1|2|')), [['<table><thead><tr><td>a</td><td>b</td></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b\n|-|-\n|1|2')), [['<table><thead><tr><td>a</td><td>b</td></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|\n|-|\n|1|')), [['<table><thead><tr><td>a</td></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a\n|-\n|1')), [['<table><thead><tr><td>a</td></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('||\n|-\n||')), [['<table><thead><tr><td></td></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('||\n|-\n||\\')), [['<table><thead><tr><td></td></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('||\n|-\n||\\\n')), [['<table><thead><tr><td></td></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|| \n|- \n|| ')), [['<table><thead><tr><td></td></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|| \n|-| \n|| ')), [['<table><thead><tr><td></td></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|!http://host\n|-\n|')), [['<table><thead><tr><td>!<a href="http://host" rel="noopener" target="_blank">http://host</a></td></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|\n|-\n|!http://host')), [['<table><thead><tr></tr></thead><tbody><tr><td>!<a href="http://host" rel="noopener" target="_blank">http://host</a></td></tr></tbody></table>'], '']);
    });

    it('align', () => {
      assert.deepStrictEqual(inspect(parser('|h|\n|:-|\n|b|')), [['<table><thead><tr><td style="text-align: left;">h</td></tr></thead><tbody><tr><td style="text-align: left;">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-:|\n|b|')), [['<table><thead><tr><td style="text-align: right;">h</td></tr></thead><tbody><tr><td style="text-align: right;">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|:-:|\n|b|')), [['<table><thead><tr><td style="text-align: center;">h</td></tr></thead><tbody><tr><td style="text-align: center;">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|-|\n|b|b|')), [['<table><thead><tr><td style="text-align: left;">h</td><td style="text-align: left;">h</td></tr></thead><tbody><tr><td style="text-align: left;">b</td><td style="text-align: left;">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|:-|\n|b|b|')), [['<table><thead><tr><td style="text-align: left;">h</td><td style="text-align: left;">h</td></tr></thead><tbody><tr><td style="text-align: left;">b</td><td style="text-align: left;">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|:-:|\n|b|b|')), [['<table><thead><tr><td style="text-align: left;">h</td><td style="text-align: center;">h</td></tr></thead><tbody><tr><td style="text-align: left;">b</td><td style="text-align: center;">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|-:|\n|b|b|')), [['<table><thead><tr><td style="text-align: left;">h</td><td style="text-align: right;">h</td></tr></thead><tbody><tr><td style="text-align: left;">b</td><td style="text-align: right;">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|h|\n|:-:|:-|-:|\n|b|b|b|')), [['<table><thead><tr><td style="text-align: center;">h</td><td style="text-align: left;">h</td><td style="text-align: left;">h</td></tr></thead><tbody><tr><td style="text-align: center;">b</td><td style="text-align: left;">b</td><td style="text-align: right;">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|\n|b|b|')), [['<table><thead><tr><td style="text-align: left;">h</td><td style="text-align: left;">h</td></tr></thead><tbody><tr><td style="text-align: left;">b</td><td style="text-align: left;">b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|-|\n|b|b|')), [['<table><thead><tr><td style="text-align: left;">h</td><td style="text-align: left;">h</td></tr></thead><tbody><tr><td style="text-align: left;">b</td><td style="text-align: left;">b</td></tr></tbody></table>'], '']);
    });

    it('trim', () => {
      assert.deepStrictEqual(inspect(parser('|  h  \n|-\n|  b  ')), [['<table><thead><tr><td>h</td></tr></thead><tbody><tr><td>b</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|  h  |\n|-\n|  b  |')), [['<table><thead><tr><td>h</td></tr></thead><tbody><tr><td>b</td></tr></tbody></table>'], '']);
    });

  });

});
