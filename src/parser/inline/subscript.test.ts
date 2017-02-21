import { loop } from '../../combinator/loop';
import { subscript } from './subscript';
import { inspect } from '../debug.test';

describe('Unit: parser/subscript', () => {
  describe('subscript', () => {
    it('invalid', () => {
      const parser = loop(subscript);
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~ ~')), void 0);
      assert.deepStrictEqual(inspect(parser('~ a~')), void 0);
      assert.deepStrictEqual(inspect(parser('~a ~')), void 0);
      assert.deepStrictEqual(inspect(parser('~ a ~')), void 0);
      assert.deepStrictEqual(inspect(parser('~\n~')), void 0);
      assert.deepStrictEqual(inspect(parser('~a\nb~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~a~~')), void 0);
      assert.deepStrictEqual(inspect(parser('a~a~')), void 0);
    });

    it('ab', () => {
      const parser = loop(subscript);
      assert.deepStrictEqual(inspect(parser('~a~')), [['<sub>a</sub>'], '']);
      assert.deepStrictEqual(inspect(parser('~ab~')), [['<sub>ab</sub>'], '']);
      assert.deepStrictEqual(inspect(parser('~a b~')), [['<sub>a b</sub>'], '']);
    });

    it('nest', () => {
      const parser = loop(subscript);
      assert.deepStrictEqual(inspect(parser('~*a*~')), [['<sub>*a*</sub>'], '']);
      assert.deepStrictEqual(inspect(parser('~<u>~')), [['<sub>&lt;u&gt;</sub>'], '']);
    });

  });

});
