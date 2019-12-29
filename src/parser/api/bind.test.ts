import { ParserConfigs } from '../../..';
import { bind } from './bind';
import { html } from 'typed-dom';

describe('Unit: parser/api/bind', () => {
  describe('bind', () => {
    function inspect(iter: Iterable<HTMLElement | undefined>) {
      return [...iter].filter(e => e?.parentNode).map(e => e?.outerHTML);
    }
    const cfgs: ParserConfigs = { footnote: { annotation: html('ol'), reference: html('ol') } };

    it('empty', () => {
      const el = html('div');
      const update = bind(el, cfgs);

      // init with empty
      assert.deepStrictEqual(inspect(update('')), []);
      assert(el.innerHTML === '');
      // update with no changes
      assert.deepStrictEqual(inspect(update('')), []);
      assert(el.innerHTML === '');
    });

    it('update', () => {
      const el = html('div', [html('ol')]);
      const update = bind(el, cfgs);

      // init with nonempty
      assert.deepStrictEqual(inspect(update('0')), ['<p>0</p>']);
      assert(el.innerHTML === '<p>0</p><ol></ol>');
      // update with no changes
      assert.deepStrictEqual(inspect(update('0')), []);
      assert(el.innerHTML === '<p>0</p><ol></ol>');
      // clear
      assert.deepStrictEqual(inspect(update('')), []);
      assert(el.innerHTML === '<ol></ol>');

      // format
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n')), ['<p>1</p>', '<p>0</p>', '<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><ol></ol>');
      // change top segments
      assert.deepStrictEqual(inspect(update('9\n\n5\n\n9\n\n')), ['<p>9</p>', '<p>5</p>']);
      assert(el.innerHTML === '<p>9</p><p>5</p><p>9</p><ol></ol>');
      // change bottom segments
      assert.deepStrictEqual(inspect(update('9\n\n0\n\n1\n\n')), ['<p>0</p>', '<p>1</p>']);
      assert(el.innerHTML === '<p>9</p><p>0</p><p>1</p><ol></ol>');
      // change middle segments
      assert.deepStrictEqual(inspect(update('9\n\n5\n\n1\n\n')), ['<p>5</p>']);
      assert(el.innerHTML === '<p>9</p><p>5</p><p>1</p><ol></ol>');
      // change segments at the both ends 
      assert.deepStrictEqual(inspect(update('1\n\n5\n\n9\n\n')), ['<p>1</p>', '<p>5</p>', '<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>5</p><p>9</p><ol></ol>');
      // insert
      assert.deepStrictEqual(inspect(update('1\n\n2\n\n3\n\n9\n\n')), ['<p>2</p>', '<p>3</p>']);
      assert(el.innerHTML === '<p>1</p><p>2</p><p>3</p><p>9</p><ol></ol>');
      // remove
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n')), ['<p>0</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><ol></ol>');

      // format
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n')), []);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><ol></ol>');
      // repeat the top segment
      assert.deepStrictEqual(inspect(update('1\n\n1\n\n0\n\n9\n\n')), ['<p>1</p>']);
      assert(el.innerHTML === '<p>1</p><p>1</p><p>0</p><p>9</p><ol></ol>');
      // repeat the bottom segment
      assert.deepStrictEqual(inspect(update('1\n\n1\n\n0\n\n9\n\n9\n\n')), ['<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>1</p><p>0</p><p>9</p><p>9</p><ol></ol>');

      // format
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(1))), ['<p>0</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><ol></ol>');
      // repeat
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(2))), ['<p>1</p>', '<p>0</p>', '<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><p>1</p><p>0</p><p>9</p><ol></ol>');
      // unrepeat
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(1))), []);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><ol></ol>');
    });

    it('complex', () => {
      assert.deepStrictEqual(inspect(bind(html('div'), cfgs)('# a\n# b')), ['<h1 id="index:a">a</h1>', '<h1 id="index:b">b</h1>']);
    });

    it('normalize', () => {
      assert.deepStrictEqual(inspect(bind(html('div'), cfgs)('a\\\r\nb')), ['<p>a<span class="linebreak"> </span>b</p>']);
    });

    it('reentrant', () => {
      const el = html('div');
      const update = bind(el, cfgs);

      const iter = update('0\n\n1\n');
      assert(iter.next().value?.outerHTML === '<p>0</p>');
      assert.deepStrictEqual(inspect(update('0\n\n1\n\n2')), ['<p>1</p>', '<p>2</p>']);
      assert(el.innerHTML === '<p>0</p><p>1</p><p>2</p>');
      assert.deepStrictEqual(inspect(update('3\n')), ['<p>3</p>']);
      assert(el.innerHTML === '<p>3</p>');
      assert.deepStrictEqual(iter.next(), { value: undefined, done: false });
      assert.deepStrictEqual(iter.next(), { value: undefined, done: true });
      assert(el.innerHTML === '<p>3</p>');
      assert.deepStrictEqual(inspect(update('3\n\n4')), ['<p>4</p>']);
      assert(el.innerHTML === '<p>3</p><p>4</p>');
    });

    it('concurrency', () => {
      function inspect(iter: Iterator<HTMLElement | undefined, undefined>, count: number) {
        return [...Array(count)]
          .map(() => iter.next())
          .map(res =>
            res.done
              ? true
              : res.value?.outerHTML);
      }

      const el = html('div');
      const update = bind(el, cfgs);

      assert.deepStrictEqual(inspect(update('1\n'), 1), ['<p>1</p>']);
      assert(el.innerHTML === '<p>1</p>');
      assert.deepStrictEqual(inspect(update('1\n\n3\n\n4'), 1), ['<p>3</p>']);
      assert(el.innerHTML === '<p>1</p><p>3</p>');
      assert.deepStrictEqual(inspect(update('1\n\n2\n\n4'), 4), ['<p>2</p>', '<p>4</p>', '<p>3</p>', true]);
      assert(el.innerHTML === '<p>1</p><p>2</p><p>4</p>');
      [...update('')];
      assert(el.innerHTML === '');
      assert.deepStrictEqual(inspect(update('# a\n# b'), 1), ['<h1 id="index:a">a</h1>']);
      assert(el.innerHTML === '<h1 id="index:a">a</h1>');
      assert.deepStrictEqual(inspect(update('# a\n# b'), 2), ['<h1 id="index:b">b</h1>', true]);
      assert(el.innerHTML === '<h1 id="index:a">a</h1><h1 id="index:b">b</h1>');
    });

  });

});
