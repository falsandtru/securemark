import { strong } from './strong';
import { loop } from '../../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/inline/strong', () => {
  describe('strong', () => {
    const parser = loop(strong);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('*')), undefined);
      assert.deepStrictEqual(inspect(parser('**')), undefined);
      assert.deepStrictEqual(inspect(parser('***')), undefined);
      assert.deepStrictEqual(inspect(parser('****')), undefined);
      assert.deepStrictEqual(inspect(parser('** **')), undefined);
      assert.deepStrictEqual(inspect(parser('**\n**')), undefined);
      assert.deepStrictEqual(inspect(parser('**<wbr>**')), undefined);
      assert.deepStrictEqual(inspect(parser('****a****')), undefined);
      assert.deepStrictEqual(inspect(parser('a**a**')), undefined);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('**a**')), [['<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**ab**')), [['<strong>ab</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\nb**')), [['<strong>a b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\\\nb**')), [['<strong>a<br>b</strong>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('**<a>**')), [['<strong>&lt;a&gt;</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**`a`**')), [['<strong><code data-src="`a`">a</code></strong>'], '']);
    });

  });

});
