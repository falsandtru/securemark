import { loop } from '../../combinator/loop';
import { mathinline } from './mathinline';
import { inspect } from '../debug.test';

describe('Unit: parser/mathinline', () => {
  describe('mathinline', () => {
    const parser = loop(mathinline);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('$')), void 0);
      assert.deepStrictEqual(inspect(parser('$$')), void 0);
      assert.deepStrictEqual(inspect(parser('$ $')), void 0);
      assert.deepStrictEqual(inspect(parser('$ a$')), void 0);
      assert.deepStrictEqual(inspect(parser('$a $')), void 0);
      assert.deepStrictEqual(inspect(parser('$ a $')), void 0);
      assert.deepStrictEqual(inspect(parser('$\n$')), void 0);
      assert.deepStrictEqual(inspect(parser('$a\nb$')), void 0);
      assert.deepStrictEqual(inspect(parser('$a$0')), void 0);
      assert.deepStrictEqual(inspect(parser('$$a$$')), void 0);
      assert.deepStrictEqual(inspect(parser('a$a$')), void 0);
      assert.deepStrictEqual(inspect(parser('$0-$1')), void 0);
      assert.deepStrictEqual(inspect(parser('$0 - $1')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('$a$')), [['<span class="math">$a$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$ab$')), [['<span class="math">$ab$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$a b$')), [['<span class="math">$a b$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$\\a$')), [['<span class="math">$\\a$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$\\$$')), [['<span class="math">$\\$$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$\\\\$')), [['<span class="math">$\\\\$</span>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('$*a*$')), [['<span class="math">$*a*$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$<wbr>$')), [['<span class="math">$&lt;wbr&gt;$</span>'], '']);
    });

  });

});
