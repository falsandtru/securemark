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
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('||\n|-|\n||')), [['<table><thead><tr><td align=""></td></tr></thead><tbody><tr><td align=""></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|||\n|-|-|\n|||')), [['<table><thead><tr><td align=""></td><td align=""></td></tr></thead><tbody><tr><td align=""></td><td align=""></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-|\n|')), [['<table><thead><tr><td align="">h</td></tr></thead><tbody><tr><td align=""></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-|\n|v|')), [['<table><thead><tr><td align="">h</td></tr></thead><tbody><tr><td align="">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-|\n|v|\n')), [['<table><thead><tr><td align="">h</td></tr></thead><tbody><tr><td align="">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-|\n|v')), [['<table><thead><tr><td align="">h</td></tr></thead><tbody><tr><td align="">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-\n|v')), [['<table><thead><tr><td align="">h</td></tr></thead><tbody><tr><td align="">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h| \n|-| \n|v| ')), [['<table><thead><tr><td align="">h</td></tr></thead><tbody><tr><td align="">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h| \n|-| \n|v| \n')), [['<table><thead><tr><td align="">h</td></tr></thead><tbody><tr><td align="">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-|-|\n|1|2|')), [['<table><thead><tr><td align="">a</td><td align="">b</td></tr></thead><tbody><tr><td align="">1</td><td align="">2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-|-\n|1|2|')), [['<table><thead><tr><td align="">a</td><td align="">b</td></tr></thead><tbody><tr><td align="">1</td><td align="">2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-|-\n|1|2')), [['<table><thead><tr><td align="">a</td><td align="">b</td></tr></thead><tbody><tr><td align="">1</td><td align="">2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-|\n|1|2|')), [['<table><thead><tr><td align="">a</td><td align="">b</td></tr></thead><tbody><tr><td align="">1</td><td align="">2</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-|\n|1|')), [['<table><thead><tr><td align="">a</td><td align="">b</td></tr></thead><tbody><tr><td align="">1</td><td align=""></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-\n|1')), [['<table><thead><tr><td align="">a</td><td align="">b</td></tr></thead><tbody><tr><td align="">1</td><td align=""></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-\n|')), [['<table><thead><tr><td align="">a</td><td align="">b</td></tr></thead><tbody><tr><td align=""></td><td align=""></td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b|\n|-')), [['<table><thead><tr><td align="">a</td><td align="">b</td></tr></thead><tbody></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|b\n|-')), [['<table><thead><tr><td align="">a</td><td align="">b</td></tr></thead><tbody></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a|\n|-')), [['<table><thead><tr><td align="">a</td></tr></thead><tbody></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|a\n|-')), [['<table><thead><tr><td align="">a</td></tr></thead><tbody></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|\n|-')), [['<table><thead><tr><td align=""></td></tr></thead><tbody></tbody></table>'], '']);
    });

    it('align', () => {
      assert.deepStrictEqual(inspect(parser('|h|\n|:-|\n|v|')), [['<table><thead><tr><td align="left">h</td></tr></thead><tbody><tr><td align="left">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|-:|\n|v|')), [['<table><thead><tr><td align="center">h</td></tr></thead><tbody><tr><td align="right">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|\n|:-:|\n|v|')), [['<table><thead><tr><td align="center">h</td></tr></thead><tbody><tr><td align="center">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|-|\n|v|v|')), [['<table><thead><tr><td align="left">h</td><td align="">h</td></tr></thead><tbody><tr><td align="left">v</td><td align="">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|:-|\n|v|v|')), [['<table><thead><tr><td align="left">h</td><td align="left">h</td></tr></thead><tbody><tr><td align="left">v</td><td align="left">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|:-:|\n|v|v|')), [['<table><thead><tr><td align="left">h</td><td align="center">h</td></tr></thead><tbody><tr><td align="left">v</td><td align="center">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|-:|\n|v|v|')), [['<table><thead><tr><td align="left">h</td><td align="center">h</td></tr></thead><tbody><tr><td align="left">v</td><td align="right">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|h|\n|:-:|:-|-:|\n|v|v|v|')), [['<table><thead><tr><td align="center">h</td><td align="left">h</td><td align="left">h</td></tr></thead><tbody><tr><td align="center">v</td><td align="left">v</td><td align="right">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|\n|v|v|')), [['<table><thead><tr><td align="left">h</td><td align="left">h</td></tr></thead><tbody><tr><td align="left">v</td><td align="left">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|h|h|\n|:-|-|\n|v|v|')), [['<table><thead><tr><td align="left">h</td><td align="">h</td></tr></thead><tbody><tr><td align="left">v</td><td align="">v</td></tr></tbody></table>'], '']);
    });

    it('trim', () => {
      assert.deepStrictEqual(inspect(parser('|  h  \n|-\n|  v  ')), [['<table><thead><tr><td align="">h</td></tr></thead><tbody><tr><td align="">v</td></tr></tbody></table>'], '']);
      assert.deepStrictEqual(inspect(parser('|  h  |\n|-\n|  v  |')), [['<table><thead><tr><td align="">h</td></tr></thead><tbody><tr><td align="">v</td></tr></tbody></table>'], '']);
    });

  });

});
