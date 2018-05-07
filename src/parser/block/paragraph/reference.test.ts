﻿import { reference } from './reference';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/paragraph/reference', () => {
  describe('reference', () => {
    const parser = some(reference);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('> ')), undefined);
      assert.deepStrictEqual(inspect(parser('>>')), undefined);
      assert.deepStrictEqual(inspect(parser('>0 a')), undefined);
      assert.deepStrictEqual(inspect(parser('> 0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>0')), [['<a class="reference" rel="noopener" data-level="1">&gt;0</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>a')), [['<a class="reference" rel="noopener" data-level="1">&gt;a</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>A')), [['<a class="reference" rel="noopener" data-level="1">&gt;A</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>a ')), [['<a class="reference" rel="noopener" data-level="1">&gt;a</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n')), [['<a class="reference" rel="noopener" data-level="1">&gt;a</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>\\')), [['<a class="reference" rel="noopener" data-level="1">&gt;\\</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>\\ ')), [['<a class="reference" rel="noopener" data-level="1">&gt;\\</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>\\\n')), [['<a class="reference" rel="noopener" data-level="1">&gt;\\</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0')), [['<a class="reference" rel="noopener" data-level="2">&gt;&gt;0</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>0\n>1')), [['<a class="reference" rel="noopener" data-level="1">&gt;0</a>', '<br>', '<a class="reference" rel="noopener" data-level="1">&gt;1</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>0\n>>1')), [['<a class="reference" rel="noopener" data-level="1">&gt;0</a>', '<br>', '<a class="reference" rel="noopener" data-level="2">&gt;&gt;1</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n>1')), [['<a class="reference" rel="noopener" data-level="2">&gt;&gt;0</a>', '<br>', '<a class="reference" rel="noopener" data-level="1">&gt;1</a>', '<br>'], '']);
    });

  });

});
