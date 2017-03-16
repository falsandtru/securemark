﻿import { loop } from '../../combinator/loop';
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
      assert.deepStrictEqual(inspect(parser('** **')), void 0);
      assert.deepStrictEqual(inspect(parser('**\n**')), void 0);
      assert.deepStrictEqual(inspect(parser('**<wbr>**')), void 0);
      assert.deepStrictEqual(inspect(parser('****a****')), void 0);
      assert.deepStrictEqual(inspect(parser('a**a**')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('**a**')), [['<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**ab**')), [['<strong>ab</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\nb**')), [['<strong>a b</strong>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('**<a>**')), [['<strong>&lt;a&gt;</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**`<wbr>`**')), [['<strong><code>&lt;wbr&gt;</code></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**[](#)**')), [['<strong><a href="#">#</a></strong>'], '']);
    });

    it('triple', () => {
      assert.deepStrictEqual(inspect(parser('***a***')), [['<strong><em>a</em></strong>'], '']);
    });

  });

});
