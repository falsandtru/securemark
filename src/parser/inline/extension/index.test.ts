import { index } from './index';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/index', () => {
  describe('index', () => {
    const parser = some(index);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#[]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# ]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a ]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\ ]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\ a]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a\\ ]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\n]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\\n]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#[]()]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[#a]')), [['<a href="#index:a" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a b]')), [['<a href="#index:a-b" rel="noopener">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\\ b]')), [['<a href="#index:a-b" rel="noopener">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[]]')), [['<a href="#index:[]" rel="noopener">[]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\]]')), [['<a href="#index:]" rel="noopener">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\\\]')), [['<a href="#index:\\" rel="noopener">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#*a*]')), [['<a href="#index:a" rel="noopener"><em>a</em></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#`a`]')), [['<a href="#index:`a`" rel="noopener"><code data-src="`a`">a</code></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#A]')), [['<a href="#index:a" rel="noopener">A</a>'], '']);
    });

  });

});
