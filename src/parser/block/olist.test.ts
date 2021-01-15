import { olist } from './olist';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/olist', () => {
  describe('olist', () => {
    const parser = (source: string) => some(olist)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('1a. ')), undefined);
      assert.deepStrictEqual(inspect(parser('a1. ')), undefined);
      assert.deepStrictEqual(inspect(parser('aZ. ')), undefined);
      assert.deepStrictEqual(inspect(parser('Az. ')), undefined);
      assert.deepStrictEqual(inspect(parser('0')), undefined);
      assert.deepStrictEqual(inspect(parser('0 ')), undefined);
      assert.deepStrictEqual(inspect(parser('0\n')), undefined);
      assert.deepStrictEqual(inspect(parser('0.')), undefined);
      assert.deepStrictEqual(inspect(parser('0.a')), undefined);
      assert.deepStrictEqual(inspect(parser('1')), undefined);
      assert.deepStrictEqual(inspect(parser('1 ')), undefined);
      assert.deepStrictEqual(inspect(parser('1\n')), undefined);
      assert.deepStrictEqual(inspect(parser('1.')), undefined);
      assert.deepStrictEqual(inspect(parser('1.1')), undefined);
      assert.deepStrictEqual(inspect(parser('1.1.')), undefined);
      assert.deepStrictEqual(inspect(parser('1.a')), undefined);
      assert.deepStrictEqual(inspect(parser('1.\n')), undefined);
      assert.deepStrictEqual(inspect(parser('1. a\n  1. a\n 1. a')), undefined);
      assert.deepStrictEqual(inspect(parser('0.\n0 ')), undefined);
      assert.deepStrictEqual(inspect(parser('0. !http://host')), [['<ol><li>!<a href="http://host" rel="noopener" target="_blank">http://host</a></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('(I) ')), undefined);
      assert.deepStrictEqual(inspect(parser('(A) ')), undefined);
      assert.deepStrictEqual(inspect(parser(' 0.')), undefined);
    });

    it('single', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('0. ')), [['<ol><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('0. \\')), [['<ol><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. \\\n')), [['<ol><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. -')), [['<ol><li>-</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. -\n')), [['<ol><li>-</li></ol>'], '']);
      // pending
      assert.deepStrictEqual(inspect(parser('(1) ')), [['<ol data-format="paren"><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('(1) a')), [['<ol data-format="paren"><li>a</li></ol>'], '']);
    });

    it('multiple', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('0.\n0')), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0.\n0.')), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0.\n0. ')), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0.\n0.\n')), [['<ol><li></li><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('0. 1\n0. 2')), [['<ol><li>1</li><li>2</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n0. 2\n0. 3')), [['<ol><li>1</li><li>2</li><li>3</li></ol>'], '']);
      // pending
      assert.deepStrictEqual(inspect(parser('(1) \n(')), [['<ol data-format="paren"><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('(1) \n(1')), [['<ol data-format="paren"><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('(1) \n(1)')), [['<ol data-format="paren"><li></li><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('(1) \n(1) ')), [['<ol data-format="paren"><li></li><li></li></ol>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('0.\n 0')), [['<ol><li><br><ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0')), [['<ol><li>1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0.')), [['<ol><li>1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. ')), [['<ol><li>1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0.\n')), [['<ol><li>1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. 2')), [['<ol><li>1<ol><li>2</li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. 2\n 0. 3')), [['<ol><li>1<ol><li>2</li><li>3</li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. 2\n  0. 3')), [['<ol><li>1<ol><li>2<ol><li>3</li></ol></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. 2\n0. 3')), [['<ol><li>1<ol><li>2</li></ol></li><li>3</li></ol>'], '']);
    });

    it('index', () => {
      assert.deepStrictEqual(inspect(parser('1. ')), [['<ol><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('9. ')), [['<ol><li data-value="9."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('00. ')), [['<ol><li data-value="00."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('01. ')), [['<ol><li data-value="01."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0.\n1')), [['<ol><li></li><li data-value="1."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('8.\n9')), [['<ol><li data-value="8."></li><li data-value="9."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('9.\n9')), [['<ol><li data-value="9."></li><li data-value="9."></li></ol>'], '']);
    });

    it('branch', () => {
      assert.deepStrictEqual(inspect(parser('1-1. ')), [['<ol><li data-value="1-1."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1.\n1-')), [['<ol><li></li><li data-value="1-."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1.\n1-1')), [['<ol><li></li><li data-value="1-1."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('(1)-1 ')), [['<ol data-format="paren"><li data-value="(1)-1"></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('(1)\n(1)-')), [['<ol data-format="paren"><li></li><li data-value="(1)-"></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('(1)\n(1)-1')), [['<ol data-format="paren"><li></li><li data-value="(1)-1"></li></ol>'], '']);
    });

    it('type', () => {
      // Bug: Firefox
      if (navigator.userAgent.includes('Firefox')) return;
      assert.deepStrictEqual(inspect(parser('i. ')), [['<ol type="i" data-type="lower-roman"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('a. ')), [['<ol type="a" data-type="lower-alpha"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('I. ')), [['<ol type="I" data-type="upper-roman"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('A. ')), [['<ol type="A" data-type="upper-alpha"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('a.\n0.\nc')), [['<ol type="a" data-type="lower-alpha"><li></li><li data-value="0."></li><li data-value="c."></li></ol>'], '']);
    });

    it('checkbox', () => {
      assert.deepStrictEqual(inspect(parser('1. [ ]')), [['<ol><li><span class="checkbox">☐</span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. [x]')), [['<ol><li><span class="checkbox">☑</span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. [X]')), [['<ol><li><span class="checkbox">☑</span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. [X] 1')), [['<ol><li><span class="checkbox">☑</span>1</li></ol>'], '']);
    });

  });

});
