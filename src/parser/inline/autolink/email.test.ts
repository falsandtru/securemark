import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/email', () => {
  describe('email', () => {
    const parser = (source: string) => some(autolink)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('a@'), ctx), [['a'], '@']);
      assert.deepStrictEqual(inspect(parser('a@+'), ctx), [['a'], '@+']);
      assert.deepStrictEqual(inspect(parser('a@_'), ctx), [['a'], '@_']);
      assert.deepStrictEqual(inspect(parser('a@-'), ctx), [['a'], '@-']);
      assert.deepStrictEqual(inspect(parser('a@.'), ctx), [['a'], '@.']);
      assert.deepStrictEqual(inspect(parser('a@b@'), ctx), [['a'], '@b@']);
      assert.deepStrictEqual(inspect(parser('a@bc@'), ctx), [['a'], '@bc@']);
      assert.deepStrictEqual(inspect(parser('a@b@c'), ctx), [['a'], '@b@c']);
      assert.deepStrictEqual(inspect(parser('a@b#'), ctx), [['a'], '@b#']);
      assert.deepStrictEqual(inspect(parser('a@b#1'), ctx), [['a'], '@b#1']);
      assert.deepStrictEqual(inspect(parser('a@@'), ctx), [['a@', '@'], '']);
      assert.deepStrictEqual(inspect(parser('a@@b'), ctx), [['a@', '<a class="account" href="/@b">@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a+@b'), ctx), [['a'], '+@b']);
      assert.deepStrictEqual(inspect(parser('a__b@c'), ctx), [['a'], '__b@c']);
      assert.deepStrictEqual(inspect(parser('a..b@c'), ctx), [['a'], '..b@c']);
      assert.deepStrictEqual(inspect(parser('a++b@c'), ctx), [['a'], '++b@c']);
      assert.deepStrictEqual(inspect(parser('a@http://host'), ctx), [['a'], '@http://host']);
      assert.deepStrictEqual(inspect(parser('a@ttp://host'), ctx), [['a'], '@ttp://host']);
      assert.deepStrictEqual(inspect(parser(`a@${'b'.repeat(64)}`), ctx), [['a'], `@${'b'.repeat(64)}`]);
      assert.deepStrictEqual(inspect(parser(' a@b'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('a@0'), ctx), [['<a class="email" href="mailto:a@0">a@0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@b'), ctx), [['<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@A'), ctx), [['<a class="email" href="mailto:a@A">a@A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@b+'), ctx), [['<a class="email" href="mailto:a@b">a@b</a>'], '+']);
      assert.deepStrictEqual(inspect(parser('a@b+c'), ctx), [['<a class="email" href="mailto:a@b">a@b</a>'], '+c']);
      assert.deepStrictEqual(inspect(parser('a@b_'), ctx), [['<a class="email" href="mailto:a@b">a@b</a>'], '_']);
      assert.deepStrictEqual(inspect(parser('a@b_c'), ctx), [['<a class="email" href="mailto:a@b">a@b</a>'], '_c']);
      assert.deepStrictEqual(inspect(parser('a@b-'), ctx), [['<a class="email" href="mailto:a@b">a@b</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('a@b-c'), ctx), [['<a class="email" href="mailto:a@b-c">a@b-c</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@b--c'), ctx), [['<a class="email" href="mailto:a@b">a@b</a>'], '--c']);
      assert.deepStrictEqual(inspect(parser('a@b.'), ctx), [['<a class="email" href="mailto:a@b">a@b</a>'], '.']);
      assert.deepStrictEqual(inspect(parser('a@b.c'), ctx), [['<a class="email" href="mailto:a@b.c">a@b.c</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@b..c'), ctx), [['<a class="email" href="mailto:a@b">a@b</a>'], '..c']);
      assert.deepStrictEqual(inspect(parser('ab+cd@0'), ctx), [['<a class="email" href="mailto:ab+cd@0">ab+cd@0</a>'], '']);
    });

  });

});
