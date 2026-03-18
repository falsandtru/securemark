import { insertion } from './insertion';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/insertion', () => {
  describe('insertion', () => {
    const parser = some(insertion);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('+', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('++', new Context())), [['++'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a', new Context())), [['++', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a+', new Context())), [['++', 'a+'], '']);
      assert.deepStrictEqual(inspect(parser, input(' ++a++', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('++a++', new Context())), [['<ins>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a+b++', new Context())), [['<ins>a+b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++ ++', new Context())), [['<ins> </ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++ a++', new Context())), [['<ins> a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++ a ++', new Context())), [['<ins> a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++  a  ++', new Context())), [['<ins> a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++\na++', new Context())), [['<ins><br>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++\\\na++', new Context())), [['<ins><br>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++<wbr>a++', new Context())), [['<ins><wbr>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a ++', new Context())), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a \n ++', new Context())), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a\n++', new Context())), [['<ins>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a\n ++', new Context())), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a\n<wbr>++', new Context())), [['<ins>a<wbr></ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a\nb++', new Context())), [['<ins>a<br>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a\\\nb++', new Context())), [['<ins>a<br>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++\\+++', new Context())), [['<ins>+</ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++a+++', new Context())), [['<ins>a</ins>'], '+']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('++*++a++*++', new Context())), [['<ins><em><ins>a</ins></em></ins>'], '']);
      assert.deepStrictEqual(inspect(parser, input('++*~~a~~*++', new Context())), [['<ins><em><del>a</del></em></ins>'], '']);
    });

  });

});
