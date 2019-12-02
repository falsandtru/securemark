import { data } from './data';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/data', () => {
  describe('data', () => {
    const parser = (source: string) => some(data)(source, {}, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~|]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~|a]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~0]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~A]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~ |a]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~ a|b]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~a |b]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~a\n|b]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~a|\\]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~a| !http://host]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~a|<# b #>]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~-]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~a-]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~-a]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~a=|]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~a=|b]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~a=-]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~a=B]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~a=b-]')), undefined);
      assert.deepStrictEqual(inspect(parser('[~a=-b]')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('[~a]')), [['<span class="data-a" data-name="a" data-value=""></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a-b]')), [['<span class="data-a-b" data-name="a-b" data-value=""></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a|]')), [['<span class="data-a" data-name="a" data-value=""></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a|b]')), [['<span class="data-a" data-name="a" data-value="">b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a|b\nc]')), [['<span class="data-a" data-name="a" data-value="">b<br>c</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a|b\\\nc]')), [['<span class="data-a" data-name="a" data-value="">b<span class="linebreak"> </span>c</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a=0]')), [['<span class="data-a" data-name="a" data-value="0"></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a=0|]')), [['<span class="data-a" data-name="a" data-value="0"></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a=b]')), [['<span class="data-a" data-name="a" data-value="b"></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a=b-c]')), [['<span class="data-a" data-name="a" data-value="b-c"></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a=b|c]')), [['<span class="data-a" data-name="a" data-value="b">c</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a|!http://host]')), [['<span class="data-a" data-name="a" data-value=""><a href="http://host" rel="noopener" target="_blank"><img class="media" data-src="http://host" alt=""></a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a|!http://host ]')), [['<span class="data-a" data-name="a" data-value=""><a href="http://host" rel="noopener" target="_blank"><img class="media" data-src="http://host" alt=""></a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a|!http://host\\ ]')), [['<span class="data-a" data-name="a" data-value=""><a href="http://host" rel="noopener" target="_blank"><img class="media" data-src="http://host" alt=""></a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~color=red|a]')), [['<span class="data-color" data-name="color" data-value="red">a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~size=large|a]')), [['<span class="data-size" data-name="size" data-value="large">a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[~button=submit|a]')), [['<span class="data-button" data-name="button" data-value="submit">a</span>'], '']);
    });

  });

});
