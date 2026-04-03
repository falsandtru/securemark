import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/email', () => {
  describe('email', () => {
    const parser = some(autolink);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@+')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@_')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@-')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@.')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b@')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@bc@')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b@c')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b#')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b#1')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@@')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@@b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a+@b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a__b@c')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a..b@c')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a++b@c')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b_c')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b.c:d')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b.domain.com:c')), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@http://host')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' a@b')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('a@0')), [['<a class="email" href="mailto:a@0">a@0</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a@b')), [['<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a@A')), [['<a class="email" href="mailto:a@A">a@A</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a@b+')), [['<a class="email" href="mailto:a@b">a@b</a>'], '+']);
      assert.deepStrictEqual(inspect(parser, input('a@b+c')), [['<a class="email" href="mailto:a@b">a@b</a>'], '+c']);
      assert.deepStrictEqual(inspect(parser, input('a@b-')), [['<a class="email" href="mailto:a@b">a@b</a>'], '-']);
      assert.deepStrictEqual(inspect(parser, input('a@b-c')), [['<a class="email" href="mailto:a@b-c">a@b-c</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a@b--c')), [['<a class="email" href="mailto:a@b">a@b</a>'], '--c']);
      assert.deepStrictEqual(inspect(parser, input('a@b_')), [['<a class="email" href="mailto:a@b">a@b</a>'], '_']);
      assert.deepStrictEqual(inspect(parser, input('a@b.')), [['<a class="email" href="mailto:a@b">a@b</a>'], '.']);
      assert.deepStrictEqual(inspect(parser, input('a@b.c')), [['<a class="email" href="mailto:a@b.c">a@b.c</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a@b..c')), [['<a class="email" href="mailto:a@b">a@b</a>'], '..c']);
      assert.deepStrictEqual(inspect(parser, input('ab+cd@0')), [['<a class="email" href="mailto:ab+cd@0">ab+cd@0</a>'], '']);
    });

  });

});
