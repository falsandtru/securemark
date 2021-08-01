import { math } from './math';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/math', () => {
  describe('math', () => {
    const parser = (source: string) => some(math)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$0$')), undefined);
      assert.deepStrictEqual(inspect(parser('$0-$')), undefined);
      assert.deepStrictEqual(inspect(parser('$0-$1')), undefined);
      assert.deepStrictEqual(inspect(parser('$0 - $1')), undefined);
      assert.deepStrictEqual(inspect(parser('$0+$1')), undefined);
      assert.deepStrictEqual(inspect(parser('$0 + $1')), undefined);
      assert.deepStrictEqual(inspect(parser('$0-1$')), undefined);
      assert.deepStrictEqual(inspect(parser('$0+1$')), undefined);
      assert.deepStrictEqual(inspect(parser('$-0$')), undefined);
      assert.deepStrictEqual(inspect(parser('$-0$-1')), undefined);
      assert.deepStrictEqual(inspect(parser('$-a$')), undefined);
      assert.deepStrictEqual(inspect(parser('$-a$-b')), undefined);
      assert.deepStrictEqual(inspect(parser('$a-b$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a-b$c-d')), undefined);
      assert.deepStrictEqual(inspect(parser('$a+b$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a*b$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a/b$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a[b]$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a{b}$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a$b')), undefined);
      assert.deepStrictEqual(inspect(parser('$a$b$')), undefined);
      assert.deepStrictEqual(inspect(parser('$ $')), undefined);
      assert.deepStrictEqual(inspect(parser('$\n$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a\nb$')), undefined);
      assert.deepStrictEqual(inspect(parser('$a\\\nb$')), undefined);
      assert.deepStrictEqual(inspect(parser('${')), undefined);
      assert.deepStrictEqual(inspect(parser('${a')), undefined);
      assert.deepStrictEqual(inspect(parser('${$')), undefined);
      assert.deepStrictEqual(inspect(parser('${}')), undefined);
      assert.deepStrictEqual(inspect(parser('${a} $')), undefined);
      assert.deepStrictEqual(inspect(parser('${a}b$')), undefined);
      assert.deepStrictEqual(inspect(parser('${a}{b}$')), undefined);
      assert.deepStrictEqual(inspect(parser('${a{b}$')), undefined);
      assert.deepStrictEqual(inspect(parser('${a}b}$')), undefined);
      assert.deepStrictEqual(inspect(parser('${\\}$')), undefined);
      assert.deepStrictEqual(inspect(parser('${\n}$')), undefined);
      assert.deepStrictEqual(inspect(parser('${a\nb}$')), undefined);
      assert.deepStrictEqual(inspect(parser('${a\\\nb}$')), undefined);
      assert.deepStrictEqual(inspect(parser('${\\begin}$')), [['<span class="notranslate invalid">${\\begin}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${\\Huge}$')), [['<span class="notranslate invalid">${\\Huge}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${a}b$')), undefined);
      assert.deepStrictEqual(inspect(parser(' ${a}$')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('${}$')), [['<span class="math" translate="no" data-src="${}$">${}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${ }$')), [['<span class="math" translate="no" data-src="${ }$">${ }$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${a}$')), [['<span class="math" translate="no" data-src="${a}$">${a}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${a}$0')), [['<span class="math" translate="no" data-src="${a}$">${a}$</span>'], '0']);
      assert.deepStrictEqual(inspect(parser('${a}$b')), [['<span class="math" translate="no" data-src="${a}$">${a}$</span>'], 'b']);
      assert.deepStrictEqual(inspect(parser('${ab}$')), [['<span class="math" translate="no" data-src="${ab}$">${ab}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${a b}$')), [['<span class="math" translate="no" data-src="${a b}$">${a b}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${a }$')), [['<span class="math" translate="no" data-src="${a }$">${a }$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${ a}$')), [['<span class="math" translate="no" data-src="${ a}$">${ a}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${ a }$')), [['<span class="math" translate="no" data-src="${ a }$">${ a }$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${$}$')), [['<span class="math" translate="no" data-src="${$}$">${$}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${\\a}$')), [['<span class="math" translate="no" data-src="${\\a}$">${\\a}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${\\$}$')), [['<span class="math" translate="no" data-src="${\\$}$">${\\$}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${\\\\}$')), [['<span class="math" translate="no" data-src="${\\\\}$">${\\\\}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$a$')), [['<span class="math" translate="no" data-src="$a$">$a$</span>'], '']);
      assert.deepStrictEqual(inspect(parser(`$a'$`)), [[`<span class="math" translate="no" data-src="$a'$">$a'$</span>`], '']);
      assert.deepStrictEqual(inspect(parser(`$a''$`)), [[`<span class="math" translate="no" data-src="$a''$">$a''$</span>`], '']);
      assert.deepStrictEqual(inspect(parser('$a$[A](a)')), [['<span class="math" translate="no" data-src="$a$">$a$</span>'], '[A](a)']);
      assert.deepStrictEqual(inspect(parser('$a$$')), [['<span class="math" translate="no" data-src="$a$">$a$</span>'], '$']);
      assert.deepStrictEqual(inspect(parser('$A$')), [['<span class="math" translate="no" data-src="$A$">$A$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$\\$$')), [['<span class="math" translate="no" data-src="$\\$$">$\\$$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$\\Pi$')), [['<span class="math" translate="no" data-src="$\\Pi$">$\\Pi$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$\\Pi $')), [['<span class="math" translate="no" data-src="$\\Pi $">$\\Pi $</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$|1|$')), [['<span class="math" translate="no" data-src="$|1|$">$|1|$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$[0,1)$]')), [['<span class="math" translate="no" data-src="$[0,1)$">$[0,1)$</span>'], ']']);
      assert.deepStrictEqual(inspect(parser('$(0, 1]$)')), [['<span class="math" translate="no" data-src="$(0, 1]$">$(0, 1]$</span>'], ')']);
      assert.deepStrictEqual(inspect(parser('$\\{0,1\\}$')), [['<span class="math" translate="no" data-src="$\\{0,1\\}$">$\\{0,1\\}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$n=1$')), [['<span class="math" translate="no" data-src="$n=1$">$n=1$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$n<m$')), [['<span class="math" translate="no" data-src="$n<m$">$n&lt;m$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$n>m$')), [['<span class="math" translate="no" data-src="$n>m$">$n&gt;m$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$E = mc^2$')), [['<span class="math" translate="no" data-src="$E = mc^2$">$E = mc^2$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$f(x)$')), [['<span class="math" translate="no" data-src="$f(x)$">$f(x)$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$f: x \\to y$')), [['<span class="math" translate="no" data-src="$f: x \\to y$">$f: x \\to y$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$k$-space')), [['<span class="math" translate="no" data-src="$k$">$k$</span>'], '-space']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('${*a*}$')), [['<span class="math" translate="no" data-src="${*a*}$">${*a*}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${<wbr>}$')), [['<span class="math" translate="no" data-src="${<wbr>}$">${&lt;wbr&gt;}$</span>'], '']);
    });

  });

});
