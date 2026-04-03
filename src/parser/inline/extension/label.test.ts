import { label } from './label';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/label', () => {
  describe('label', () => {
    const parser = some(label);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('[]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a-')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a--')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a-.0')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a-00')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a-01')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a-0b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$a-b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$$-b')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' $a-b')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('$a-b')), [['<a class="label" data-label="a-b">$a-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$a-b.0')), [['<a class="label" data-label="a-b">$a-b</a>'], '.0']);
      assert.deepStrictEqual(inspect(parser, input('$a-b.c')), [['<a class="label" data-label="a-b">$a-b</a>'], '.c']);
      assert.deepStrictEqual(inspect(parser, input('$a-b-0')), [['<a class="label" data-label="a-b">$a-b</a>'], '-0']);
      assert.deepStrictEqual(inspect(parser, input('$a-b-1')), [['<a class="label" data-label="a-b">$a-b</a>'], '-1']);
      assert.deepStrictEqual(inspect(parser, input('$a-b-$a-c')), [['<a class="label" data-label="a-b">$a-b</a>'], '-$a-c']);
      assert.deepStrictEqual(inspect(parser, input('$a-b-0-$a-c')), [['<a class="label" data-label="a-b">$a-b</a>'], '-0-$a-c']);
      assert.deepStrictEqual(inspect(parser, input('$a-0')), [['<a class="label" data-label="a-0">$a-0</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$a-0.b')), [['<a class="label" data-label="a-0">$a-0</a>'], '.b']);
      assert.deepStrictEqual(inspect(parser, input('$a-0.0b')), [['<a class="label" data-label="a-0">$a-0</a>'], '.0b']);
      assert.deepStrictEqual(inspect(parser, input('$a-0-$a-0')), [['<a class="label" data-label="a-0">$a-0</a>'], '-$a-0']);
      assert.deepStrictEqual(inspect(parser, input('$-b')), [['<a class="label" data-label="$-b">$-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$-b-$-c')), [['<a class="label" data-label="$-b">$-b</a>'], '-$-c']);
      assert.deepStrictEqual(inspect(parser, input('$-0')), [['<a class="label" data-label="$-0">$-0</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$-0.b')), [['<a class="label" data-label="$-0">$-0</a>'], '.b']);
      assert.deepStrictEqual(inspect(parser, input('$-0.0b')), [['<a class="label" data-label="$-0">$-0</a>'], '.0b']);
      assert.deepStrictEqual(inspect(parser, input('$-0-$-0')), [['<a class="label" data-label="$-0">$-0</a>'], '-$-0']);
      assert.deepStrictEqual(inspect(parser, input('$A-B')), [['<a class="label" data-label="a-b">$A-B</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$a-b]')), [['<a class="label" data-label="a-b">$a-b</a>'], '']);
    });

  });

});
