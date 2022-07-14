import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/email', () => {
  describe('email', () => {
    const parser = (source: string) => some(autolink)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('a@')), [['a@'], '']);
      assert.deepStrictEqual(inspect(parser('a@+')), [['a@'], '+']);
      assert.deepStrictEqual(inspect(parser('a@_')), [['a@'], '_']);
      assert.deepStrictEqual(inspect(parser('a@-')), [['a@'], '-']);
      assert.deepStrictEqual(inspect(parser('a@.')), [['a@'], '.']);
      assert.deepStrictEqual(inspect(parser('a@b@')), [['a@b@'], '']);
      assert.deepStrictEqual(inspect(parser('a@bc@')), [['a@bc@'], '']);
      assert.deepStrictEqual(inspect(parser('a@b@c')), [['a@b@c'], '']);
      assert.deepStrictEqual(inspect(parser('a@b#')), [['a@b#'], '']);
      assert.deepStrictEqual(inspect(parser('a@b#1')), [['a@b#1'], '']);
      assert.deepStrictEqual(inspect(parser('a@@')), [['a@@'], '']);
      assert.deepStrictEqual(inspect(parser('a@@b')), [['a@@b'], '']);
      assert.deepStrictEqual(inspect(parser('a+@b')), [['a'], '+@b']);
      assert.deepStrictEqual(inspect(parser('a..b@c')), [['a'], '..b@c']);
      assert.deepStrictEqual(inspect(parser('a++b@c')), [['a'], '++b@c']);
      assert.deepStrictEqual(inspect(parser(`a@${'b'.repeat(64)}`)), [[`a@${'b'.repeat(64)}`], '']);
      assert.deepStrictEqual(inspect(parser(' a@b')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('a@0')), [['<a class="email" href="mailto:a@0">a@0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@b')), [['<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@A')), [['<a class="email" href="mailto:a@A">a@A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@b+')), [['<a class="email" href="mailto:a@b">a@b</a>'], '+']);
      assert.deepStrictEqual(inspect(parser('a@b+c')), [['<a class="email" href="mailto:a@b">a@b</a>'], '+c']);
      assert.deepStrictEqual(inspect(parser('a@b_')), [['<a class="email" href="mailto:a@b">a@b</a>'], '_']);
      assert.deepStrictEqual(inspect(parser('a@b_c')), [['<a class="email" href="mailto:a@b">a@b</a>'], '_c']);
      assert.deepStrictEqual(inspect(parser('a@b-')), [['<a class="email" href="mailto:a@b">a@b</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('a@b-c')), [['<a class="email" href="mailto:a@b-c">a@b-c</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@b--c')), [['<a class="email" href="mailto:a@b">a@b</a>'], '--c']);
      assert.deepStrictEqual(inspect(parser('a@b.')), [['<a class="email" href="mailto:a@b">a@b</a>'], '.']);
      assert.deepStrictEqual(inspect(parser('a@b.c')), [['<a class="email" href="mailto:a@b.c">a@b.c</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@b..c')), [['<a class="email" href="mailto:a@b">a@b</a>'], '..c']);
      assert.deepStrictEqual(inspect(parser('a@http://host')), [['<a class="email" href="mailto:a@http">a@http</a>'], '://host']);
      assert.deepStrictEqual(inspect(parser('a@ttp://host')), [['<a class="email" href="mailto:a@ttp">a@ttp</a>'], '://host']);
      assert.deepStrictEqual(inspect(parser('ab+cd@0')), [['<a class="email" href="mailto:ab+cd@0">ab+cd@0</a>'], '']);
    });

  });

});
