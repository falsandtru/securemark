import { cite } from './cite';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/reply/cite', () => {
  describe('cite', () => {
    const parser = some(cite);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>> ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>0 a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>/', new Context())), [['<span class="cite invalid">&gt;&gt;/</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>\\', new Context())), [['<span class="cite invalid">&gt;&gt;\\</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>01#', new Context())), [['<span class="cite invalid">&gt;&gt;01#</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>01@', new Context())), [['<span class="cite invalid">&gt;&gt;01@</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>http://', new Context())), [['<span class="cite invalid">&gt;&gt;http://</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>tel:1234567890', new Context())), [['<span class="cite invalid">&gt;&gt;tel:1234567890</span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> 0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' >>0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\\>>0', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('>>0', new Context())), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>0 ', new Context())), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>0\n', new Context())), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>>0', new Context())), [['<span class="cite">&gt;&gt;<a class="anchor" href="?at=0" data-depth="2">&gt;0</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>0\n1', new Context())), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '1']);
      assert.deepStrictEqual(inspect(parser, input('>>0\n>1', new Context())), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '>1']);
      assert.deepStrictEqual(inspect(parser, input('>>0\n>>', new Context())), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>'], '>>']);
      assert.deepStrictEqual(inspect(parser, input('>>0\n>>1', new Context())), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>', '<span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>0\n>>>1', new Context())), [['<span class="cite">&gt;<a class="anchor" href="?at=0" data-depth="1">&gt;0</a></span>', '<br>', '<span class="cite">&gt;&gt;<a class="anchor" href="?at=1" data-depth="2">&gt;1</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>>0\n>>', new Context())), [['<span class="cite">&gt;&gt;<a class="anchor" href="?at=0" data-depth="2">&gt;0</a></span>', '<br>'], '>>']);
      assert.deepStrictEqual(inspect(parser, input('>>>0\n>>1', new Context())), [['<span class="cite">&gt;&gt;<a class="anchor" href="?at=0" data-depth="2">&gt;0</a></span>', '<br>', '<span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>#', new Context())), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>># ', new Context())), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>#\n', new Context())), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>#a', new Context())), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#a</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>#index::a', new Context())), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#index::a</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>#:~:text=a', new Context())), [['<span class="cite">&gt;<a class="anchor" data-depth="1">&gt;#:~:text=a</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>http://host', new Context())), [['<span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>http://host)', new Context())), [['<span class="cite">&gt;<a class="anchor" href="http://host)" target="_blank" data-depth="1">&gt;http://host)</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>http://host ', new Context())), [['<span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>http://host\n', new Context())), [['<span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>https://host', new Context())), [['<span class="cite">&gt;<a class="anchor" href="https://host" target="_blank" data-depth="1">&gt;https://host</a></span>', '<br>'], '']);
    });

  });

});
