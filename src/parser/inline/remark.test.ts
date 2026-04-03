import { remark } from './remark';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/remark', () => {
  describe('remark', () => {
    const parser = some(remark);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('<')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[%')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[%[%')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[%a%]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[%a b%]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[% ')), [['[%'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% \n a')), [['[%', '<br>', ' a'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%%]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[% [%')), [['[%', ' ', '[', '%'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% [% ')), [['[%', ' ', '[%'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% [% a')), [['[%', ' ', '[%', ' a'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% [% a %]')), [['[%', ' ', '<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a[%')), [['[%', ' a', '[', '%'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a [%')), [['[%', ' a ', '[', '%'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a [% ')), [['[%', ' a ', '[%'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a [% b')), [['[%', ' a ', '[%', ' b'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a [%% b')), [['[%', ' a ', '<span class="invalid">[%%</span>', ' b'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%% a [% b')), [['<span class="invalid">[%%</span>'], ' a [% b']);
      assert.deepStrictEqual(inspect(parser, input('[%\\ a %]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[% a\\ %]')), [['[%', ' a', ' ', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a%]')), [['[%', ' a%', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a %%]')), [['[%', ' a %%', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% [%% %]')), [['<span class="remark"><input type="checkbox"><span>[% <span class="invalid">[%%</span> %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%% [% %%]')), [['<span class="invalid">[%%</span>'], ' [% %%]']);
      assert.deepStrictEqual(inspect(parser, input('[%% a %]')), [['<span class="invalid">[%%</span>'], ' a %]']);
      assert.deepStrictEqual(inspect(parser, input(' [% a %]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('[% %]')), [['<span class="remark"><input type="checkbox"><span>[% %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%  %]')), [['<span class="remark"><input type="checkbox"><span>[% %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%   %]')), [['<span class="remark"><input type="checkbox"><span>[% %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a %]')), [['<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% - %]')), [['<span class="remark"><input type="checkbox"><span>[% - %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%  a  %]')), [['<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%  -  %]')), [['<span class="remark"><input type="checkbox"><span>[% - %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a b %]')), [['<span class="remark"><input type="checkbox"><span>[% a b %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a\nb %]')), [['<span class="remark"><input type="checkbox"><span>[% a<br>b %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a %] %]')), [['<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], ' %]']);
      assert.deepStrictEqual(inspect(parser, input('[% %%] %]')), [['<span class="remark"><input type="checkbox"><span>[% %%] %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% [% a %] %]')), [['<span class="remark"><input type="checkbox"><span>[% <span class="remark"><input type="checkbox"><span>[% a %]</span></span> %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a %]b')), [['<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('[%\na\n%]')), [['<span class="remark"><input type="checkbox"><span>[%<br>a<br>%]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% &a; %]')), [['<span class="remark"><input type="checkbox"><span>[% <span class="invalid">&amp;a;</span> %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% &copy; %]')), [['<span class="remark"><input type="checkbox"><span>[% © %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% &amp;copy; %]')), [['<span class="remark"><input type="checkbox"><span>[% &amp;copy; %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% [ %]')), [['<span class="remark"><input type="checkbox"><span>[% [ %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% \\ a %]')), [['<span class="remark"><input type="checkbox"><span>[%  a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% $-a %]$')), [['<span class="remark"><input type="checkbox"><span>[% <a class="label" data-label="$-a">$-a</a> %]</span></span>'], '$']);
      assert.deepStrictEqual(inspect(parser, input('[% <bdi> %]')), [['<span class="remark"><input type="checkbox"><span>[% <span class="invalid">&lt;bdi&gt;</span> %]</span></span>'], '']);
    });

  });

});
