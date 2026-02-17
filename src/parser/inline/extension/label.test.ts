import { label } from './label';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/label', () => {
  describe('label', () => {
    const parser = (source: string) => some(label)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('[]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$a-'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$a--'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$a-.0'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$a-00'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$a-01'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$a-0b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$$a-b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$$$-b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' $a-b'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('$a-b'), ctx), [['<a class="label" data-label="a-b">$a-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$a-b.0'), ctx), [['<a class="label" data-label="a-b">$a-b</a>'], '.0']);
      assert.deepStrictEqual(inspect(parser('$a-b.c'), ctx), [['<a class="label" data-label="a-b">$a-b</a>'], '.c']);
      assert.deepStrictEqual(inspect(parser('$a-b-0'), ctx), [['<a class="label" data-label="a-b">$a-b</a>'], '-0']);
      assert.deepStrictEqual(inspect(parser('$a-b-1'), ctx), [['<a class="label" data-label="a-b">$a-b</a>'], '-1']);
      assert.deepStrictEqual(inspect(parser('$a-b-$a-c'), ctx), [['<a class="label" data-label="a-b">$a-b</a>'], '-$a-c']);
      assert.deepStrictEqual(inspect(parser('$a-b-0-$a-c'), ctx), [['<a class="label" data-label="a-b">$a-b</a>'], '-0-$a-c']);
      assert.deepStrictEqual(inspect(parser('$a-0'), ctx), [['<a class="label" data-label="a-0">$a-0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$a-0.b'), ctx), [['<a class="label" data-label="a-0">$a-0</a>'], '.b']);
      assert.deepStrictEqual(inspect(parser('$a-0.0b'), ctx), [['<a class="label" data-label="a-0">$a-0</a>'], '.0b']);
      assert.deepStrictEqual(inspect(parser('$a-0-$a-0'), ctx), [['<a class="label" data-label="a-0">$a-0</a>'], '-$a-0']);
      assert.deepStrictEqual(inspect(parser('$-b'), ctx), [['<a class="label" data-label="$-b">$-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$-b-$-c'), ctx), [['<a class="label" data-label="$-b">$-b</a>'], '-$-c']);
      assert.deepStrictEqual(inspect(parser('$-0'), ctx), [['<a class="label" data-label="$-0">$-0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$-0.b'), ctx), [['<a class="label" data-label="$-0">$-0</a>'], '.b']);
      assert.deepStrictEqual(inspect(parser('$-0.0b'), ctx), [['<a class="label" data-label="$-0">$-0</a>'], '.0b']);
      assert.deepStrictEqual(inspect(parser('$-0-$-0'), ctx), [['<a class="label" data-label="$-0">$-0</a>'], '-$-0']);
      assert.deepStrictEqual(inspect(parser('$A-B'), ctx), [['<a class="label" data-label="a-b">$A-B</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[$a-b]'), ctx), [['<a class="label" data-label="a-b">$a-b</a>'], '']);
    });

  });

});
