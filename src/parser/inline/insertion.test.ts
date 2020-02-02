import { insertion } from './insertion';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/insertion', () => {
  describe('insertion', () => {
    const parser = (source: string) => some(insertion)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('+')), undefined);
      assert.deepStrictEqual(inspect(parser('++')), undefined);
      assert.deepStrictEqual(inspect(parser('+++')), undefined);
      assert.deepStrictEqual(inspect(parser('++++')), undefined);
      assert.deepStrictEqual(inspect(parser('+++++')), undefined);
      assert.deepStrictEqual(inspect(parser('++++a++b++')), undefined);
      assert.deepStrictEqual(inspect(parser('++++a++b++c++++')), undefined);
      assert.deepStrictEqual(inspect(parser('a++a++')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('++a++')), [['<ins>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a+++')), [['<ins>a</ins>'], '+']);
      assert.deepStrictEqual(inspect(parser('++a ++')), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ a++')), [['<ins> a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ a ++')), [['<ins> a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ ++')), [['<ins> </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('+++a++')), [['<ins>+a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('+++a+++')), [['<ins>+a</ins>'], '+']);
      assert.deepStrictEqual(inspect(parser('++\n++')), [['<ins><br></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++\\\n++')), [['<ins><span class="linebreak"> </span></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++<wbr>++')), [['<ins><wbr></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ab++')), [['<ins>ab</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\nb++')), [['<ins>a<br>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\\\nb++')), [['<ins>a<span class="linebreak"> </span>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++\\+++')), [['<ins>+</ins>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('++*++a++*++')), [['<ins><em><span class="invalid" data-invalid-syntax="insertion" data-invalid-message="Cannot nest this syntax">++a++</span></em></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++*~~a~~*++')), [['<ins><em><span class="invalid" data-invalid-syntax="deletion" data-invalid-message="Cannot nest this syntax">~~a~~</span></em></ins>'], '']);
    });

  });

});
