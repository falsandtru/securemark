import { cite } from './cite';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/reply/cite', () => {
  describe('cite', () => {
    const parser = (source: string) => some(cite)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('>0')), undefined);
      assert.deepStrictEqual(inspect(parser('>\n')), undefined);
      assert.deepStrictEqual(inspect(parser('>>')), undefined);
      assert.deepStrictEqual(inspect(parser('>> ')), undefined);
      assert.deepStrictEqual(inspect(parser('>>0 a')), undefined);
      assert.deepStrictEqual(inspect(parser('>>/')), [['<span class="cite invalid">&gt;&gt;/</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>\\')), [['<span class="cite invalid">&gt;&gt;\\</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>01#')), [['<span class="cite invalid">&gt;&gt;01#</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>01@')), [['<span class="cite invalid">&gt;&gt;01@</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>http://')), [['<span class="cite invalid">&gt;&gt;http://</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>tel:1234567890')), [['<span class="cite invalid">&gt;&gt;tel:1234567890</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>> 0')), undefined);
      assert.deepStrictEqual(inspect(parser(' >>0')), undefined);
      assert.deepStrictEqual(inspect(parser('\\>>0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>>0')), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0 ')), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n')), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>0')), [['<span class="cite">&gt;&gt;<a class="anchor" href="?at=0" data-depth="2">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n1')), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '1']);
      assert.deepStrictEqual(inspect(parser('>>0\n>1')), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '>1']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>')), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '>>']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>1')), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>', '<span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>>1')), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>', '<span class="cite">&gt;&gt;<a class="anchor" href="?at=1" data-depth="2">&gt;1</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>0\n>>')), [['<span class="cite">&gt;&gt;<a class="anchor" href="?at=0" data-depth="2">&gt;0</a></span>', '<br>'], '>>']);
      assert.deepStrictEqual(inspect(parser('>>>0\n>>1')), [['<span class="cite">&gt;&gt;<a class="anchor" href="?at=0" data-depth="2">&gt;0</a></span>', '<br>', '<span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>#')), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>># ')), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>#\n')), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>#a')), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#a</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>#index::a')), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#index::a</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>#:~:text=a')), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#:~:text=a</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>http://host')), [['<span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>http://host)')), [['<span class="cite">&gt;<a class="anchor" href="http://host)" target="_blank" data-depth="1">&gt;http://host)</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>http://host ')), [['<span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>http://host\n')), [['<span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>https://host')), [['<span class="cite">&gt;<a class="anchor" href="https://host" target="_blank" data-depth="1">&gt;https://host</a></span>', '<br>'], '']);
    });

  });

});
