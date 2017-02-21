import { loop } from '../../combinator/loop';
import { strong } from './strong';
import { inspect } from '../debug.test';

describe('Unit: parser/strong', () => {
  describe('strong', () => {
    const parser = loop(strong);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('*')), void 0);
      assert.deepStrictEqual(inspect(parser('**')), void 0);
      assert.deepStrictEqual(inspect(parser('***')), void 0);
      assert.deepStrictEqual(inspect(parser('****')), void 0);
      assert.deepStrictEqual(inspect(parser('****a****')), void 0);
      assert.deepStrictEqual(inspect(parser('**<var>**')), void 0);
      assert.deepStrictEqual(inspect(parser('a**a**')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('**a**')), [['<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**ab**')), [['<strong>ab</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\nb**')), [['<strong>ab</strong>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('**<a>**')), [['<strong>&lt;a&gt;</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**\\<a>**')), [['<strong>&lt;a&gt;</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**\\<var>**')), [['<strong>&lt;var&gt;</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**<var></var>**')), [['<strong><var></var></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**`<var>`**')), [['<strong><code>&lt;var&gt;</code></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**[](#)**')), [['<strong><a href="#">#</a></strong>'], '']);
    });

    it('triple', () => {
      assert.deepStrictEqual(inspect(parser('***\\<a>***')), [['<strong><em>&lt;a&gt;</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***\\<var>***')), [['<strong><em>&lt;var&gt;</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***<var></var>***')), [['<strong><em><var></var></em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***`<var>`***')), [['<strong><em><code>&lt;var&gt;</code></em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***[](#)***')), [['<strong><em><a href="#">#</a></em></strong>'], '']);
    });

  });

});
