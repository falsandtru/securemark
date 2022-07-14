import { label } from './label';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/label', () => {
  describe('label', () => {
    const parser = (source: string) => some(label)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a')), undefined);
      assert.deepStrictEqual(inspect(parser('$a-')), undefined);
      assert.deepStrictEqual(inspect(parser('$a--')), undefined);
      assert.deepStrictEqual(inspect(parser('$a-.0')), undefined);
      assert.deepStrictEqual(inspect(parser('$a-00')), undefined);
      assert.deepStrictEqual(inspect(parser('$a-01')), undefined);
      assert.deepStrictEqual(inspect(parser('$a-0b')), undefined);
      assert.deepStrictEqual(inspect(parser('$$a-b')), undefined);
      assert.deepStrictEqual(inspect(parser('$$$-b')), undefined);
      assert.deepStrictEqual(inspect(parser(' $a-b')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('$a-b')), [['<a class="label" data-label="a-b">$a-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$a-b.0')), [['<a class="label" data-label="a-b">$a-b</a>'], '.0']);
      assert.deepStrictEqual(inspect(parser('$a-b.c')), [['<a class="label" data-label="a-b">$a-b</a>'], '.c']);
      assert.deepStrictEqual(inspect(parser('$a-b-0')), [['<a class="label" data-label="a-b">$a-b</a>'], '-0']);
      assert.deepStrictEqual(inspect(parser('$a-b-1')), [['<a class="label" data-label="a-b">$a-b</a>'], '-1']);
      assert.deepStrictEqual(inspect(parser('$a-b-$a-c')), [['<a class="label" data-label="a-b">$a-b</a>'], '-$a-c']);
      assert.deepStrictEqual(inspect(parser('$a-b-0-$a-c')), [['<a class="label" data-label="a-b">$a-b</a>'], '-0-$a-c']);
      assert.deepStrictEqual(inspect(parser('$a-0')), [['<a class="label" data-label="a-0">$a-0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$a-0.b')), [['<a class="label" data-label="a-0">$a-0</a>'], '.b']);
      assert.deepStrictEqual(inspect(parser('$a-0.0b')), [['<a class="label" data-label="a-0">$a-0</a>'], '.0b']);
      assert.deepStrictEqual(inspect(parser('$a-0-$a-0')), [['<a class="label" data-label="a-0">$a-0</a>'], '-$a-0']);
      assert.deepStrictEqual(inspect(parser('$-b')), [['<a class="label" data-label="$-b">$-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$-b-$-c')), [['<a class="label" data-label="$-b">$-b</a>'], '-$-c']);
      assert.deepStrictEqual(inspect(parser('$-0')), [['<a class="label" data-label="$-0">$-0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$-0.b')), [['<a class="label" data-label="$-0">$-0</a>'], '.b']);
      assert.deepStrictEqual(inspect(parser('$-0.0b')), [['<a class="label" data-label="$-0">$-0</a>'], '.0b']);
      assert.deepStrictEqual(inspect(parser('$-0-$-0')), [['<a class="label" data-label="$-0">$-0</a>'], '-$-0']);
      assert.deepStrictEqual(inspect(parser('$A-B')), [['<a class="label" data-label="a-b">$A-B</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[$a-b]')), [['<a class="label" data-label="a-b">$a-b</a>'], '']);
    });

  });

});
