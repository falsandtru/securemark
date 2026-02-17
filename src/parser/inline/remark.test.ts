import { remark } from './remark';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/remark', () => {
  describe('remark', () => {
    const parser = (source: string) => some(remark)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('<'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[%'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[%[%'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[%a%]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[%a b%]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[% '), ctx), [['[%'], '']);
      assert.deepStrictEqual(inspect(parser('[% \n a'), ctx), [['[%', '<br>', ' ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('[%%]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[% [%'), ctx), [['[%', ' ', '[', '%'], '']);
      assert.deepStrictEqual(inspect(parser('[% [% '), ctx), [['[%', ' ', '[%'], '']);
      assert.deepStrictEqual(inspect(parser('[% [% a'), ctx), [['[%', ' ', '[%', ' ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('[% [% a %]'), ctx), [['[%', ' ', '<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a[%'), ctx), [['[%', ' ', 'a', '[', '%'], '']);
      assert.deepStrictEqual(inspect(parser('[% a [%'), ctx), [['[%', ' ', 'a', ' ', '[', '%'], '']);
      assert.deepStrictEqual(inspect(parser('[% a [% '), ctx), [['[%', ' ', 'a', ' ', '[%'], '']);
      assert.deepStrictEqual(inspect(parser('[% a [% b'), ctx), [['[%', ' ', 'a', ' ', '[%', ' ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[% a [%% b'), ctx), [['[%', ' ', 'a', ' ', '[%%', ' ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[%% a [% b'), ctx), [['[%%', ' ', 'a', ' ', '[%', ' ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[%\\ a %]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[% a\\ %]'), ctx), [['[%', ' ', 'a', ' ', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[% a%]'), ctx), [['[%', ' ', 'a', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[% a %%]'), ctx), [['[%', ' ', 'a', ' ', '%', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[% [%% %]'), ctx), [['[%', ' ', '[%%', ' ', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[%% [% %%]'), ctx), [['[%%', ' ', '[%', ' ', '%', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[%% a %]'), ctx), [['[%%', ' ', 'a', ' ', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser(' [% a %]'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[% %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[%  %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[%  %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[%   %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[%   %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[%  a  %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[%  a  %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a b %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% a b %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a\nb %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% a<br>b %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a %] %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], ' %]']);
      assert.deepStrictEqual(inspect(parser('[% %%] %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% %%] %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% [% a %] %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% <span class="remark"><input type="checkbox"><span>[% a %]</span></span> %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% [%% a %%] %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% <span class="remark"><input type="checkbox"><span>[%% a %%]</span></span> %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[%% a %%]'), ctx), [['<span class="remark"><input type="checkbox"><span>[%% a %%]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[%% %] %%]'), ctx), [['<span class="remark"><input type="checkbox"><span>[%% %] %%]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[%% [% a %] %%]'), ctx), [['<span class="remark"><input type="checkbox"><span>[%% <span class="remark"><input type="checkbox"><span>[% a %]</span></span> %%]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a %]b'), ctx), [['<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], 'b']);
      assert.deepStrictEqual(inspect(parser('[%\na\n%]'), ctx), [['<span class="remark"><input type="checkbox"><span>[%<br>a<br>%]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% &a; %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% <span class="invalid">&amp;a;</span> %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% &copy; %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% © %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% &amp;copy; %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% &amp;copy; %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% [ %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% [ %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% \\ a %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[%  a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[% $-a %]$'), ctx), [['<span class="remark"><input type="checkbox"><span>[% <a class="label" data-label="$-a">$-a</a> %]</span></span>'], '$']);
      assert.deepStrictEqual(inspect(parser('[% <bdi> %]'), ctx), [['<span class="remark"><input type="checkbox"><span>[% <span class="invalid">&lt;bdi&gt;</span> %]</span></span>'], '']);
    });

  });

});
