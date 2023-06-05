import { insertion } from './insertion';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/insertion', () => {
  describe('insertion', () => {
    const parser = (source: string) => some(insertion)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('+')), undefined);
      assert.deepStrictEqual(inspect(parser('++')), undefined);
      assert.deepStrictEqual(inspect(parser('++a')), [['++', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('++a+')), [['++', 'a', '+'], '']);
      assert.deepStrictEqual(inspect(parser(' ++a++')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('++a++')), [['<ins>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a+b++')), [['<ins>a+b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ ++')), [['<ins> </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ a++')), [['<ins> a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ a ++')), [['<ins> a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++  a  ++')), [['<ins>  a  </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++\na++')), [['<ins><br>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++\\\na++')), [['<ins><br>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++<wbr>a++')), [['<ins><wbr>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a ++')), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a \n ++')), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\n++')), [['<ins>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\n ++')), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\n<wbr>++')), [['<ins>a<wbr></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\nb++')), [['<ins>a<br>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\\\nb++')), [['<ins>a<br>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++\\+++')), [['<ins>+</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a+++')), [['<ins>a</ins>'], '+']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('++*++a++*++')), [['<ins><em><ins>a</ins></em></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++*~~a~~*++')), [['<ins><em><del>a</del></em></ins>'], '']);
    });

  });

});
