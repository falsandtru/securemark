import { mathinline } from './mathinline';
import { loop } from '../../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/inline/mathinline', () => {
  describe('mathinline', () => {
    const parser = loop(mathinline);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$ $')), undefined);
      assert.deepStrictEqual(inspect(parser('$ a$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a $')), undefined);
      assert.deepStrictEqual(inspect(parser('$ a $')), undefined);
      assert.deepStrictEqual(inspect(parser('$\n$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a\nb$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a\\\nb$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a$0')), undefined);
      assert.deepStrictEqual(inspect(parser('$$a$$')), undefined);
      assert.deepStrictEqual(inspect(parser('a$a$')), undefined);
      assert.deepStrictEqual(inspect(parser('$0-$1')), undefined);
      assert.deepStrictEqual(inspect(parser('$0 - $1')), undefined);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('$a$')), [['<span class="math" data-src="$a$">$a$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$ab$')), [['<span class="math" data-src="$ab$">$ab$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$a b$')), [['<span class="math" data-src="$a b$">$a b$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$\\a$')), [['<span class="math" data-src="$\\a$">$\\a$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$\\$$')), [['<span class="math" data-src="$\\$$">$\\$$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$\\\\$')), [['<span class="math" data-src="$\\\\$">$\\\\$</span>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('$*a*$')), [['<span class="math" data-src="$*a*$">$*a*$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$<wbr>$')), [['<span class="math" data-src="$<wbr>$">$&lt;wbr&gt;$</span>'], '']);
    });

  });

});
