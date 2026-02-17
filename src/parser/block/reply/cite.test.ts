import { cite } from './cite';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/reply/cite', () => {
  describe('cite', () => {
    const parser = (source: string) => some(cite)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>0'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>> '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>0 a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>/'), ctx), [['<span class="cite invalid">&gt;&gt;/</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>\\'), ctx), [['<span class="cite invalid">&gt;&gt;\\</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>01#'), ctx), [['<span class="cite invalid">&gt;&gt;01#</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>01@'), ctx), [['<span class="cite invalid">&gt;&gt;01@</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>http://'), ctx), [['<span class="cite invalid">&gt;&gt;http://</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>tel:1234567890'), ctx), [['<span class="cite invalid">&gt;&gt;tel:1234567890</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>> 0'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' >>0'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\\>>0'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>>0'), ctx), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0 '), ctx), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n'), ctx), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>0'), ctx), [['<span class="cite">&gt;&gt;<a class="anchor" href="?at=0" data-depth="2">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n1'), ctx), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '1']);
      assert.deepStrictEqual(inspect(parser('>>0\n>1'), ctx), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '>1']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>'), ctx), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '>>']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>1'), ctx), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>', '<span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0\n>>>1'), ctx), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>', '<span class="cite">&gt;&gt;<a class="anchor" href="?at=1" data-depth="2">&gt;1</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>0\n>>'), ctx), [['<span class="cite">&gt;&gt;<a class="anchor" href="?at=0" data-depth="2">&gt;0</a></span>', '<br>'], '>>']);
      assert.deepStrictEqual(inspect(parser('>>>0\n>>1'), ctx), [['<span class="cite">&gt;&gt;<a class="anchor" href="?at=0" data-depth="2">&gt;0</a></span>', '<br>', '<span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>#'), ctx), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>># '), ctx), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>#\n'), ctx), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>#a'), ctx), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#a</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>#index::a'), ctx), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#index::a</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>#:~:text=a'), ctx), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#:~:text=a</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>http://host'), ctx), [['<span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>http://host)'), ctx), [['<span class="cite">&gt;<a class="anchor" href="http://host)" target="_blank" data-depth="1">&gt;http://host)</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>http://host '), ctx), [['<span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>http://host\n'), ctx), [['<span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('>>https://host'), ctx), [['<span class="cite">&gt;<a class="anchor" href="https://host" target="_blank" data-depth="1">&gt;https://host</a></span>', '<br>'], '']);
    });

  });

});
