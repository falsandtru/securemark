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
      assert.deepStrictEqual(inspect(parser('* *')), void 0);
      assert.deepStrictEqual(inspect(parser('*\n*')), void 0);
      assert.deepStrictEqual(inspect(parser('*<wbr>*')), void 0);
      assert.deepStrictEqual(inspect(parser('**a**')), void 0);
      assert.deepStrictEqual(inspect(parser('a*a*')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('*a*')), [['<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*ab*')), [['<em>ab</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\nb*')), [['<em>a b</em>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('*<ruby>*')), [['<em>&lt;ruby&gt;</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*`<ruby>`*')), [['<em><code>&lt;ruby&gt;</code></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*`<wbr>`*')), [['<em><code>&lt;wbr&gt;</code></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*[](#)*')), [['<em><a href="#">#</a></em>'], '']);
    });

  });

});
