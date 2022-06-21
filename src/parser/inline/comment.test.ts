import { comment } from './comment';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/comment', () => {
  describe('comment', () => {
    const parser = (source: string) => some(comment)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('<')), undefined);
      assert.deepStrictEqual(inspect(parser('[%')), undefined);
      assert.deepStrictEqual(inspect(parser('[%[%')), undefined);
      assert.deepStrictEqual(inspect(parser('[%a%]')), undefined);
      assert.deepStrictEqual(inspect(parser('[%a b%]')), undefined);
      assert.deepStrictEqual(inspect(parser('[% ')), [['[%'], '']);
      assert.deepStrictEqual(inspect(parser('[% \n a')), [['[%', '<br>', ' ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('[%%]')), undefined);
      assert.deepStrictEqual(inspect(parser('[% [%')), [['[%', ' ', '[', '%'], '']);
      assert.deepStrictEqual(inspect(parser('[% [% ')), [['[%', ' ', '[%'], '']);
      assert.deepStrictEqual(inspect(parser('[% [% a')), [['[%', ' ', '[%', ' ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('[% [% a %]')), [['[%', ' ', '<span class="comment"><input type="checkbox"><span>[% a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a[%')), [['[%', ' ', 'a', '[', '%'], '']);
      assert.deepStrictEqual(inspect(parser('[% a [%')), [['[%', ' ', 'a', ' ', '[', '%'], '']);
      assert.deepStrictEqual(inspect(parser('[% a [% ')), [['[%', ' ', 'a', ' ', '[%'], '']);
      assert.deepStrictEqual(inspect(parser('[% a [% b')), [['[%', ' ', 'a', ' ', '[%', ' ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[% a [%% b')), [['[%', ' ', 'a', ' ', '[%%', ' ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[%% a [% b')), [['[%%', ' ', 'a', ' ', '[%', ' ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[%\\ a %]')), undefined);
      assert.deepStrictEqual(inspect(parser('[% a\\ %]')), [['[%', ' ', 'a', ' ', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[% a%]')), [['[%', ' ', 'a', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[% a %%]')), [['[%', ' ', 'a', ' ', '%', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[% [%% %]')), [['[%', ' ', '[%%', ' ', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[%% [% %%]')), [['[%%', ' ', '[%', ' ', '%', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[%% a %]')), [['[%%', ' ', 'a', ' ', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser(' [% a %]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[% %]')), [['<span class="comment"><input type="checkbox"><span>[% %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[%  %]')), [['<span class="comment"><input type="checkbox"><span>[%  %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[%   %]')), [['<span class="comment"><input type="checkbox"><span>[%   %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a %]')), [['<span class="comment"><input type="checkbox"><span>[% a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a b %]')), [['<span class="comment"><input type="checkbox"><span>[% a b %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a\nb %]')), [['<span class="comment"><input type="checkbox"><span>[% a<br>b %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a %] %]')), [['<span class="comment"><input type="checkbox"><span>[% a %]</span></span>'], ' %]']);
      assert.deepStrictEqual(inspect(parser('[% %%] %]')), [['<span class="comment"><input type="checkbox"><span>[% %%] %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% [% a %] %]')), [['<span class="comment"><input type="checkbox"><span>[% <span class="comment"><input type="checkbox"><span>[% a %]</span></span> %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% [%% a %%] %]')), [['<span class="comment"><input type="checkbox"><span>[% <span class="comment"><input type="checkbox"><span>[%% a %%]</span></span> %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[%% a %%]')), [['<span class="comment"><input type="checkbox"><span>[%% a %%]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[%% %] %%]')), [['<span class="comment"><input type="checkbox"><span>[%% %] %%]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[%% [% a %] %%]')), [['<span class="comment"><input type="checkbox"><span>[%% <span class="comment"><input type="checkbox"><span>[% a %]</span></span> %%]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a %]b')), [['<span class="comment"><input type="checkbox"><span>[% a %]</span></span>'], 'b']);
      assert.deepStrictEqual(inspect(parser('[%\na\n%]')), [['<span class="comment"><input type="checkbox"><span>[%<br>a<br>%]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% &a; %]')), [['<span class="comment"><input type="checkbox"><span>[% <span class="invalid">&amp;a;</span> %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% &copy; %]')), [['<span class="comment"><input type="checkbox"><span>[% © %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% &amp;copy; %]')), [['<span class="comment"><input type="checkbox"><span>[% &amp;copy; %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% [ %]')), [['<span class="comment"><input type="checkbox"><span>[% [ %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% \\ a %]')), [['<span class="comment"><input type="checkbox"><span>[%  a %]</span></span>'], '']);
    });

  });

});
