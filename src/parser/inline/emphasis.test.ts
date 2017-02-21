import { loop } from '../../combinator/loop';
import { emphasis } from './emphasis';
import { inspect } from '../debug.test';

describe('Unit: parser/emphasis', () => {
  describe('emphasis', () => {
    const parser = loop(emphasis);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('*')), void 0);
      assert.deepStrictEqual(inspect(parser('**')), void 0);
      assert.deepStrictEqual(inspect(parser('**a**')), void 0);
      assert.deepStrictEqual(inspect(parser('*<var>*')), void 0);
      assert.deepStrictEqual(inspect(parser('a*a*')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('*a*')), [['<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*ab*')), [['<em>ab</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\nb*')), [['<em>ab</em>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('*<a>*')), [['<em>&lt;a&gt;</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*\\<a>*')), [['<em>&lt;a&gt;</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*\\<var>*')), [['<em>&lt;var&gt;</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*<var></var>*')), [['<em><var></var></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*`<var>`*')), [['<em><code>&lt;var&gt;</code></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*[](#)*')), [['<em><a href="#">#</a></em>'], '']);
    });

  });

});
