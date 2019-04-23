import { email } from './email';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/email', () => {
  describe('email', () => {
    const parser = some(email);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('a@')), [['a@'], '']);
      assert.deepStrictEqual(inspect(parser('a@_')), [['a@_'], '']);
      assert.deepStrictEqual(inspect(parser('a@-')), [['a@-'], '']);
      assert.deepStrictEqual(inspect(parser('a@_b')), [['a@_b'], '']);
      assert.deepStrictEqual(inspect(parser('a@-b')), [['a@-b'], '']);
      assert.deepStrictEqual(inspect(parser('a@b@')), [['a@b@'], '']);
      assert.deepStrictEqual(inspect(parser('a@bc@')), [['a@bc@'], '']);
      assert.deepStrictEqual(inspect(parser('a@b@c')), [['a@b@c'], '']);
      assert.deepStrictEqual(inspect(parser('a@@')), [['a@@'], '']);
      assert.deepStrictEqual(inspect(parser('a@@b')), [['a@@b'], '']);
      assert.deepStrictEqual(inspect(parser(' a@b')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('a@0')), [['<a class="email" href="mailto:a@0" rel="noopener">a@0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@a')), [['<a class="email" href="mailto:a@a" rel="noopener">a@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@A')), [['<a class="email" href="mailto:a@A" rel="noopener">a@A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@a_b')), [['<a class="email" href="mailto:a@a" rel="noopener">a@a</a>'], '_b']);
      assert.deepStrictEqual(inspect(parser('a@a__b')), [['<a class="email" href="mailto:a@a" rel="noopener">a@a</a>'], '__b']);
      assert.deepStrictEqual(inspect(parser('a@a-')), [['<a class="email" href="mailto:a@a" rel="noopener">a@a</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('a@a-b')), [['<a class="email" href="mailto:a@a-b" rel="noopener">a@a-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@a--b')), [['<a class="email" href="mailto:a@a--b" rel="noopener">a@a--b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@http://host')), [['<a class="email" href="mailto:a@http" rel="noopener">a@http</a>'], '://host']);
      assert.deepStrictEqual(inspect(parser('a@ttp://host')), [['<a class="email" href="mailto:a@ttp" rel="noopener">a@ttp</a>'], '://host']);
      assert.deepStrictEqual(inspect(parser('a@a#')), [['<a class="email" href="mailto:a@a" rel="noopener">a@a</a>'], '#']);
      assert.deepStrictEqual(inspect(parser('a@a#1')), [['<a class="email" href="mailto:a@a" rel="noopener">a@a</a>'], '#1']);
    });

  });

});
