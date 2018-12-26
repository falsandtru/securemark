import { math } from './math';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/math', () => {
  describe('math', () => {
    const parser = some(math);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a$')), undefined);
      assert.deepStrictEqual(inspect(parser('$0-$1')), undefined);
      assert.deepStrictEqual(inspect(parser('$0 - $1')), undefined);
      assert.deepStrictEqual(inspect(parser('${}$')), undefined);
      assert.deepStrictEqual(inspect(parser('${ }$')), undefined);
      assert.deepStrictEqual(inspect(parser('${\n}$')), undefined);
      assert.deepStrictEqual(inspect(parser('${a\nb}$')), undefined);
      assert.deepStrictEqual(inspect(parser('${a\\\nb}$')), undefined);
      assert.deepStrictEqual(inspect(parser('$${a}$')), undefined);
      assert.deepStrictEqual(inspect(parser('$${a}$$')), undefined);
      assert.deepStrictEqual(inspect(parser('a${a}$')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('${a}$')), [['<span class="math notranslate" data-src="${a}$">${a}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${a}$0')), [['<span class="math notranslate" data-src="${a}$">${a}$</span>'], '0']);
      assert.deepStrictEqual(inspect(parser('${a}$b')), [['<span class="math notranslate" data-src="${a}$">${a}$</span>'], 'b']);
      assert.deepStrictEqual(inspect(parser('${ab}$')), [['<span class="math notranslate" data-src="${ab}$">${ab}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${a b}$')), [['<span class="math notranslate" data-src="${a b}$">${a b}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${a }$')), [['<span class="math notranslate" data-src="${a}$">${a}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${ a}$')), [['<span class="math notranslate" data-src="${a}$">${a}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${ a }$')), [['<span class="math notranslate" data-src="${a}$">${a}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${$}$')), [['<span class="math notranslate" data-src="${$}$">${$}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${\\a}$')), [['<span class="math notranslate" data-src="${\\a}$">${\\a}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${\\$}$')), [['<span class="math notranslate" data-src="${\\$}$">${\\$}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${\\\\}$')), [['<span class="math notranslate" data-src="${\\\\}$">${\\\\}$</span>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('${*a*}$')), [['<span class="math notranslate" data-src="${*a*}$">${*a*}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${<wbr>}$')), [['<span class="math notranslate" data-src="${<wbr>}$">${&lt;wbr&gt;}$</span>'], '']);
    });

  });

});
