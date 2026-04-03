import { insertion } from './insertion';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/insertion', () => {
  describe('insertion', () => {
    const parser = some(insertion);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('+')), undefined);
      assert.deepStrictEqual(inspect(parser, input('++')), [['++'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a')), [['++', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a+')), [['++', 'a+'], '']);
      assert.deepStrictEqual(inspect(parser, input(' ++a++')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('++a++')), [['<ins>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a+b++')), [['<ins>a+b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++ ++')), [['<ins> </ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++ a++')), [['<ins> a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++ a ++')), [['<ins> a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++  a  ++')), [['<ins> a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++\na++')), [['<ins><br>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++\\\na++')), [['<ins><br>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++<wbr>a++')), [['<ins><wbr>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a ++')), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a \n ++')), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a\n++')), [['<ins>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a\n ++')), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a\n<wbr>++')), [['<ins>a<wbr></ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a\nb++')), [['<ins>a<br>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a\\\nb++')), [['<ins>a<br>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++\\+++')), [['<ins>+</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a+++')), [['<ins>a</ins>'], '+']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('++*++a++*++')), [['<ins><em><ins>a</ins></em></ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++*~~a~~*++')), [['<ins><em><del>a</del></em></ins>'], '']);
    });

  });

});
