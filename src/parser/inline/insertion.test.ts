import { insertion } from './insertion';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/insertion', () => {
  describe('insertion', () => {
    const parser = (source: string) => some(insertion)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('+'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('++'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('++a'), ctx), [['++', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('++a+'), ctx), [['++', 'a', '+'], '']);
      assert.deepStrictEqual(inspect(parser(' ++a++'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('++a++'), ctx), [['<ins>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a+b++'), ctx), [['<ins>a+b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ ++'), ctx), [['<ins> </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ a++'), ctx), [['<ins> a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ a ++'), ctx), [['<ins> a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++  a  ++'), ctx), [['<ins>  a  </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++\na++'), ctx), [['<ins><br>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++\\\na++'), ctx), [['<ins><br>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++<wbr>a++'), ctx), [['<ins><wbr>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a ++'), ctx), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a \n ++'), ctx), [['<ins>a  </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\n++'), ctx), [['<ins>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\n ++'), ctx), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\n<wbr>++'), ctx), [['<ins>a<wbr></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\nb++'), ctx), [['<ins>a<br>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\\\nb++'), ctx), [['<ins>a<br>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++\\+++'), ctx), [['<ins>+</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a+++'), ctx), [['<ins>a</ins>'], '+']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('++*++a++*++'), ctx), [['<ins><em><ins>a</ins></em></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++*~~a~~*++'), ctx), [['<ins><em><del>a</del></em></ins>'], '']);
    });

  });

});
