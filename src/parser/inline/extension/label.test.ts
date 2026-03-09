import { label } from './label';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/label', () => {
  describe('label', () => {
    const parser = some(label);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('[]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a-', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a--', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a-.0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a-00', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a-01', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$a-0b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$a-b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$$-b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' $a-b', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('$a-b', new Context())), [['<a class="label" data-label="a-b">$a-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$a-b.0', new Context())), [['<a class="label" data-label="a-b">$a-b</a>'], '.0']);
      assert.deepStrictEqual(inspect(parser, input('$a-b.c', new Context())), [['<a class="label" data-label="a-b">$a-b</a>'], '.c']);
      assert.deepStrictEqual(inspect(parser, input('$a-b-0', new Context())), [['<a class="label" data-label="a-b">$a-b</a>'], '-0']);
      assert.deepStrictEqual(inspect(parser, input('$a-b-1', new Context())), [['<a class="label" data-label="a-b">$a-b</a>'], '-1']);
      assert.deepStrictEqual(inspect(parser, input('$a-b-$a-c', new Context())), [['<a class="label" data-label="a-b">$a-b</a>'], '-$a-c']);
      assert.deepStrictEqual(inspect(parser, input('$a-b-0-$a-c', new Context())), [['<a class="label" data-label="a-b">$a-b</a>'], '-0-$a-c']);
      assert.deepStrictEqual(inspect(parser, input('$a-0', new Context())), [['<a class="label" data-label="a-0">$a-0</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$a-0.b', new Context())), [['<a class="label" data-label="a-0">$a-0</a>'], '.b']);
      assert.deepStrictEqual(inspect(parser, input('$a-0.0b', new Context())), [['<a class="label" data-label="a-0">$a-0</a>'], '.0b']);
      assert.deepStrictEqual(inspect(parser, input('$a-0-$a-0', new Context())), [['<a class="label" data-label="a-0">$a-0</a>'], '-$a-0']);
      assert.deepStrictEqual(inspect(parser, input('$-b', new Context())), [['<a class="label" data-label="$-b">$-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$-b-$-c', new Context())), [['<a class="label" data-label="$-b">$-b</a>'], '-$-c']);
      assert.deepStrictEqual(inspect(parser, input('$-0', new Context())), [['<a class="label" data-label="$-0">$-0</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$-0.b', new Context())), [['<a class="label" data-label="$-0">$-0</a>'], '.b']);
      assert.deepStrictEqual(inspect(parser, input('$-0.0b', new Context())), [['<a class="label" data-label="$-0">$-0</a>'], '.0b']);
      assert.deepStrictEqual(inspect(parser, input('$-0-$-0', new Context())), [['<a class="label" data-label="$-0">$-0</a>'], '-$-0']);
      assert.deepStrictEqual(inspect(parser, input('$A-B', new Context())), [['<a class="label" data-label="a-b">$A-B</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$a-b]', new Context())), [['<a class="label" data-label="a-b">$a-b</a>'], '']);
    });

  });

});
