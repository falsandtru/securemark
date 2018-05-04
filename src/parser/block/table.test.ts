import { table } from './table';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/table', () => {
  describe('table', () => {
    const parser = some(table);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('|')), undefined);
      assert.deepStrictEqual(inspect(parser('||')), undefined);
      assert.deepStrictEqual(inspect(parser('|h')), undefined);
      assert.deepStrictEqual(inspect(parser('|h|')), undefined);
      assert.deepStrictEqual(inspect(parser('|h|\n')), undefined);
      assert.deepStrictEqual(inspect(parser('|h|\n|')), undefined);
      assert.deepStrictEqual(inspect(parser('|h|\n||')), undefined);
      assert.deepStrictEqual(inspect(parser('|\n|-\na')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('||\n|-|\n||')), [['<table><thead><tr><td></td></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|||\n|-|-|\n|||')), [['<table><thead><tr><td></td><td></td></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-|\n|')), [['<table><thead><tr><td>h</td></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-|\n|v|')), [['<table><thead><tr><td>h</td></tr></thead><tbody><tr><td>v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-|\n|v|\n')), [['<table><thead><tr><td>h</td></tr></thead><tbody><tr><td>v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-|\n|v')), [['<table><thead><tr><td>h</td></tr></thead><tbody><tr><td>v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-\n|v')), [['<table><thead><tr><td>h</td></tr></thead><tbody><tr><td>v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h| \n|-| \n|v| ')), [['<table><thead><tr><td>h</td></tr></thead><tbody><tr><td>v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h| \n|-| \n|v| \n')), [['<table><thead><tr><td>h</td></tr></thead><tbody><tr><td>v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-|-|\n|1|2|')), [['<table><thead><tr><td>a</td><td>b</td></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-|-\n|1|2|')), [['<table><thead><tr><td>a</td><td>b</td></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-|-\n|1|2')), [['<table><thead><tr><td>a</td><td>b</td></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-|\n|1|2|')), [['<table><thead><tr><td>a</td><td>b</td></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-|\n|1|')), [['<table><thead><tr><td>a</td><td>b</td></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-\n|1')), [['<table><thead><tr><td>a</td><td>b</td></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-\n|')), [['<table><thead><tr><td>a</td><td>b</td></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|\n|-\n|')), [['<table><thead><tr></tr></thead><tbody><tr></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|\n|-\n|\\')), [['<table><thead><tr></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|\n|-\n|\\\n')), [['<table><thead><tr></tr></thead><tbody><tr><td></td></tr></tbody></table>'], '']);
    });

    it('align', () => {
      assert.deepStrictEqual(inspect(parser('|h|\n|:-|\n|v|')), [['<table><thead><tr><td style="text-align: left;">h</td></tr></thead><tbody><tr><td style="text-align: left;">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-:|\n|v|')), [['<table><thead><tr><td style="text-align: right;">h</td></tr></thead><tbody><tr><td style="text-align: right;">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|:-:|\n|v|')), [['<table><thead><tr><td style="text-align: center;">h</td></tr></thead><tbody><tr><td style="text-align: center;">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|-|\n|v|v|')), [['<table><thead><tr><td style="text-align: left;">h</td><td style="text-align: left;">h</td></tr></thead><tbody><tr><td style="text-align: left;">v</td><td style="text-align: left;">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|:-|\n|v|v|')), [['<table><thead><tr><td style="text-align: left;">h</td><td style="text-align: left;">h</td></tr></thead><tbody><tr><td style="text-align: left;">v</td><td style="text-align: left;">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|:-:|\n|v|v|')), [['<table><thead><tr><td style="text-align: left;">h</td><td style="text-align: center;">h</td></tr></thead><tbody><tr><td style="text-align: left;">v</td><td style="text-align: center;">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|-:|\n|v|v|')), [['<table><thead><tr><td style="text-align: left;">h</td><td style="text-align: right;">h</td></tr></thead><tbody><tr><td style="text-align: left;">v</td><td style="text-align: right;">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|h|\n|:-:|:-|-:|\n|v|v|v|')), [['<table><thead><tr><td style="text-align: center;">h</td><td style="text-align: left;">h</td><td style="text-align: left;">h</td></tr></thead><tbody><tr><td style="text-align: center;">v</td><td style="text-align: left;">v</td><td style="text-align: right;">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|\n|v|v|')), [['<table><thead><tr><td style="text-align: left;">h</td><td style="text-align: left;">h</td></tr></thead><tbody><tr><td style="text-align: left;">v</td><td style="text-align: left;">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|-|\n|v|v|')), [['<table><thead><tr><td style="text-align: left;">h</td><td style="text-align: left;">h</td></tr></thead><tbody><tr><td style="text-align: left;">v</td><td style="text-align: left;">v</td></tr></tbody></table>'], '']);
    });

    it('trim', () => {
      assert.deepStrictEqual(inspect(parser('|  h  \n|-\n|  v  ')), [['<table><thead><tr><td>h</td></tr></thead><tbody><tr><td>v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|  h  |\n|-\n|  v  |')), [['<table><thead><tr><td>h</td></tr></thead><tbody><tr><td>v</td></tr></tbody></table>'], '']);
    });

  });

});
