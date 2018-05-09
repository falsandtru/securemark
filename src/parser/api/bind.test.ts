import { bind } from './bind';
import { html } from 'typed-dom';

describe('Unit: parser/api/bind', () => {
  describe('bind', () => {
    function inspect(iter: Iterable<HTMLElement>) {
      return [...iter].map(e => e.outerHTML);
    }

    it('empty', () => {
      const el = html('div');
      const update = bind(el);

      // init with empty
      assert.deepStrictEqual(inspect(update('')), []);
      assert(el.innerHTML === '');
      // update with no changes
      assert.deepStrictEqual(inspect(update('')), []);
      assert(el.innerHTML === '');
    });

    it('update', () => {
      const el = html('div', [html('ol')]);
      const update = bind(el);

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

    it('reentrant', () => {
      const el = html('div');
      const update = bind(el);

      for (const _ of update('0\n\n1')) {
        assert.deepStrictEqual(inspect(update('1')), ['<p>1</p>']);
        assert(el.innerHTML === '<p>1</p>');
      }
      assert(el.innerHTML === '<p>1</p>');
    });

  });

});
