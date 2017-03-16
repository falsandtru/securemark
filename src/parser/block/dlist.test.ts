import { loop } from '../../combinator/loop';
import { dlist } from './dlist';
import { inspect } from '../debug.test';

describe('Unit: parser/dlist', () => {
  describe('dlist', () => {
    const parser = loop(dlist);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~0')), void 0);
      assert.deepStrictEqual(inspect(parser('~a')), void 0);
      assert.deepStrictEqual(inspect(parser('~')), void 0);
      assert.deepStrictEqual(inspect(parser('~:')), void 0);
      assert.deepStrictEqual(inspect(parser('~a:b')), void 0);
      assert.deepStrictEqual(inspect(parser('~a\n:b')), void 0);
      assert.deepStrictEqual(inspect(parser('~a\n: b')), void 0);
      assert.deepStrictEqual(inspect(parser(' ')), void 0);
      assert.deepStrictEqual(inspect(parser(' ~')), void 0);
    });

    it('single', () => {
      assert.deepStrictEqual(inspect(parser('~\n')), [['<dl><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~\n:')), [['<dl><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~\n\n')), [['<dl><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~\n:\n')), [['<dl><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ \n')), [['<dl><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ \n:')), [['<dl><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ \n ')), [['<dl><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ \n: ')), [['<dl><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ \n \n')), [['<dl><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ \n: \n')), [['<dl><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~\n~\n')), [['<dl><dt></dt><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~\n~\n:')), [['<dl><dt></dt><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~\n:\n:')), [['<dl><dt></dt><dd></dd><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~\na\n:')), [['<dl><dt></dt><dd>a</dd><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~\n:\nb')), [['<dl><dt></dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~\na\n: b')), [['<dl><dt></dt><dd>a</dd><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a: b')), [['<dl><dt>a: b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n~b')), [['<dl><dt>a</dt><dd>~b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n:b')), [['<dl><dt>a</dt><dd>:b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n')), [['<dl><dt>a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\nc')), [['<dl><dt>a</dt><dd>b c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a \n: b \nc ')), [['<dl><dt>a</dt><dd>b  c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a \n: b\n c ')), [['<dl><dt>a</dt><dd>b  c</dd></dl>'], '']);
    });

    it('multiple', () => {
      assert.deepStrictEqual(inspect(parser('~\n:\n~\n:')), [['<dl><dt></dt><dd></dd><dt></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n~ c\n: d')), [['<dl><dt>a</dt><dd>b</dd><dt>c</dt><dd>d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n  b\nc\n  d')), [['<dl><dt>a</dt><dd>b c   d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\nc\n: d')), [['<dl><dt>a</dt><dd>b c</dd><dd>d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\nc\n~ d\n: e')), [['<dl><dt>a</dt><dd>b c</dd><dt>d</dt><dd>e</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n~ c\n: d\n~ e\n: f')), [['<dl><dt>a</dt><dd>b</dd><dt>c</dt><dd>d</dd><dt>e</dt><dd>f</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n\n~ c\n: d')), [['<dl><dt>a</dt><dd>b</dd></dl>', '<dl><dt>c</dt><dd>d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n\n\n~ c\n: d')), [['<dl><dt>a</dt><dd>b</dd></dl>'], '\n~ c\n: d']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('~ ~*a*\n: ~*b*')), [['<dl><dt>~<em>a</em></dt><dd>~<em>b</em></dd></dl>'], '']);
    });

  });

});
