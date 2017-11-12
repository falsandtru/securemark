import { loop } from '../../../combinator';
import { index } from './index';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/extension/index', () => {
  describe('index', () => {
    const parser = loop(index);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\n]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\\n]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\]')), undefined);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('[#a]')), [['<a href="#index:a" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a b]')), [['<a href="#index:a-b" rel="noopener">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\]]')), [['<a href="#index:]" rel="noopener">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\\\]')), [['<a href="#index:\\" rel="noopener">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#`a`]')), [['<a href="#index:`a`" rel="noopener">`a`</a>'], '']);
    });

  });

});
