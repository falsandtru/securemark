import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/email', () => {
  describe('email', () => {
    const parser = some(autolink);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@+', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@_', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@-', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@.', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@bc@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b@c', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b#', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b#1', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@@b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a+@b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a__b@c', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a..b@c', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a++b@c', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b.c:d', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@b.domain.com:c', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a@http://host', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' a@b', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('a@0', new Context())), [['<a class="email" href="mailto:a@0">a@0</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a@b', new Context())), [['<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a@A', new Context())), [['<a class="email" href="mailto:a@A">a@A</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a@b+', new Context())), [['<a class="email" href="mailto:a@b">a@b</a>'], '+']);
      assert.deepStrictEqual(inspect(parser, input('a@b+c', new Context())), [['<a class="email" href="mailto:a@b">a@b</a>'], '+c']);
      assert.deepStrictEqual(inspect(parser, input('a@b_', new Context())), [['<a class="email" href="mailto:a@b">a@b</a>'], '_']);
      assert.deepStrictEqual(inspect(parser, input('a@b_c', new Context())), [['<a class="email" href="mailto:a@b">a@b</a>'], '_c']);
      assert.deepStrictEqual(inspect(parser, input('a@b-', new Context())), [['<a class="email" href="mailto:a@b">a@b</a>'], '-']);
      assert.deepStrictEqual(inspect(parser, input('a@b-c', new Context())), [['<a class="email" href="mailto:a@b-c">a@b-c</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a@b--c', new Context())), [['<a class="email" href="mailto:a@b">a@b</a>'], '--c']);
      assert.deepStrictEqual(inspect(parser, input('a@b.', new Context())), [['<a class="email" href="mailto:a@b">a@b</a>'], '.']);
      assert.deepStrictEqual(inspect(parser, input('a@b.c', new Context())), [['<a class="email" href="mailto:a@b.c">a@b.c</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a@b..c', new Context())), [['<a class="email" href="mailto:a@b">a@b</a>'], '..c']);
      assert.deepStrictEqual(inspect(parser, input('ab+cd@0', new Context())), [['<a class="email" href="mailto:ab+cd@0">ab+cd@0</a>'], '']);
    });

  });

});
