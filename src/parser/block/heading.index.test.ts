import { loop } from '../../combinator/loop';
import { index } from './heading.index';
import { inspect } from '../debug.test';

describe('Unit: parser/heading.index', () => {
  describe('index', () => {
    const parser = loop(index);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('[#a]')), void 0);
      assert.deepStrictEqual(inspect(parser(' ')), void 0);
      assert.deepStrictEqual(inspect(parser(' #')), void 0);
      assert.deepStrictEqual(inspect(parser(' #a')), void 0);
      assert.deepStrictEqual(inspect(parser(' [#]')), void 0);
      assert.deepStrictEqual(inspect(parser(' [# ]')), void 0);
      assert.deepStrictEqual(inspect(parser(' [#a ]')), void 0);
      assert.deepStrictEqual(inspect(parser(' [#a] ')), void 0);
      assert.deepStrictEqual(inspect(parser(' [#a] [#b]')), void 0);
      assert.deepStrictEqual(inspect(parser(' [#a]\n')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser(' [#a]')), [['<span class="identifier">a</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [#]]')), [['<span class="identifier">]</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [#\\]')), [['<span class="identifier">\\</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' [#a][#b]')), [['<span class="identifier">a][#b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('  [#a]')), [['<span class="identifier">a</span>'], '']);
    });

  });

});
