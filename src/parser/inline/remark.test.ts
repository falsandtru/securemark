import { remark } from './remark';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/remark', () => {
  describe('remark', () => {
    const parser = some(remark);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('<', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[%', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[%[%', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[%a%]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[%a b%]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[% ', new Context())), [['[%'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% \n a', new Context())), [['[%', '<br>', ' a'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%%]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[% [%', new Context())), [['[%', ' ', '[', '%'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% [% ', new Context())), [['[%', ' ', '[%'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% [% a', new Context())), [['[%', ' ', '[%', ' a'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% [% a %]', new Context())), [['[%', ' ', '<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a[%', new Context())), [['[%', ' a', '[', '%'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a [%', new Context())), [['[%', ' a ', '[', '%'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a [% ', new Context())), [['[%', ' a ', '[%'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a [% b', new Context())), [['[%', ' a ', '[%', ' b'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a [%% b', new Context())), [['[%', ' a ', '<span class="invalid">[%%</span>', ' b'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%% a [% b', new Context())), [['<span class="invalid">[%%</span>'], ' a [% b']);
      assert.deepStrictEqual(inspect(parser, input('[%\\ a %]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[% a\\ %]', new Context())), [['[%', ' a', ' ', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a%]', new Context())), [['[%', ' a', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a %%]', new Context())), [['[%', ' a %', '%', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% [%% %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% <span class="invalid">[%%</span> %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%% [% %%]', new Context())), [['<span class="invalid">[%%</span>'], ' [% %%]']);
      assert.deepStrictEqual(inspect(parser, input('[%% a %]', new Context())), [['<span class="invalid">[%%</span>'], ' a %]']);
      assert.deepStrictEqual(inspect(parser, input(' [% a %]', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('[% %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%  %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%   %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% - %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% - %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%  a  %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%  -  %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% - %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a b %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% a b %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a\nb %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% a<br>b %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a %] %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], ' %]']);
      assert.deepStrictEqual(inspect(parser, input('[% %%] %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% %%] %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% [% a %] %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% <span class="remark"><input type="checkbox"><span>[% a %]</span></span> %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a %]b', new Context())), [['<span class="remark"><input type="checkbox"><span>[% a %]</span></span>'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('[%\na\n%]', new Context())), [['<span class="remark"><input type="checkbox"><span>[%<br>a<br>%]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% &a; %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% <span class="invalid">&amp;a;</span> %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% &copy; %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% © %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% &amp;copy; %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% &amp;copy; %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% [ %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% [ %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% \\ a %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[%  a %]</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% $-a %]$', new Context())), [['<span class="remark"><input type="checkbox"><span>[% <a class="label" data-label="$-a">$-a</a> %]</span></span>'], '$']);
      assert.deepStrictEqual(inspect(parser, input('[% <bdi> %]', new Context())), [['<span class="remark"><input type="checkbox"><span>[% <span class="invalid">&lt;bdi&gt;</span> %]</span></span>'], '']);
    });

  });

});
