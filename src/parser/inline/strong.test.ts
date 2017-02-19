import { loop } from '../../combinator/loop';
import { strong } from './strong';
import { inspect } from '../debug.test';

describe('Unit: parser/strong', () => {
  describe('strong', () => {
    it('invalid', () => {
      const parser = loop(strong);
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('*')), void 0);
      assert.deepStrictEqual(inspect(parser('**')), void 0);
      assert.deepStrictEqual(inspect(parser('***')), void 0);
      assert.deepStrictEqual(inspect(parser('****')), void 0);
      assert.deepStrictEqual(inspect(parser('****a****')), void 0);
      assert.deepStrictEqual(inspect(parser('**<u>**')), void 0);
      assert.deepStrictEqual(inspect(parser('a**a**')), void 0);
    });

    it('ab', () => {
      const parser = loop(strong);
      assert.deepStrictEqual(inspect(parser('**a**')), [['<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**ab**')), [['<strong>ab</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\nb**')), [['<strong>ab</strong>'], '']);
    });

    it('nest', () => {
      const parser = loop(strong);
      assert.deepStrictEqual(inspect(parser('**<a>**')), [['<strong>&lt;a&gt;</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**\\<a>**')), [['<strong>&lt;a&gt;</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**\\<u>**')), [['<strong>&lt;u&gt;</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**<u></u>**')), [['<strong><u></u></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**`<u>`**')), [['<strong><code>&lt;u&gt;</code></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**[](#)**')), [['<strong><a href="#">#</a></strong>'], '']);
    });

    it('triple', () => {
      const parser = loop(strong);
      assert.deepStrictEqual(inspect(parser('***\\<a>***')), [['<strong><em>&lt;a&gt;</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***\\<u>***')), [['<strong><em>&lt;u&gt;</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***<u></u>***')), [['<strong><em><u></u></em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***`<u>`***')), [['<strong><em><code>&lt;u&gt;</code></em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***[](#)***')), [['<strong><em><a href="#">#</a></em></strong>'], '']);
    });

  });

});
