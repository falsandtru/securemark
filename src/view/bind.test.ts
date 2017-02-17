import { bind } from './bind';

describe('Unit: binder/bind', () => {
  describe('bind', () => {
    it('update', () => {
      const el = document.createElement('div');
      const update = bind(el, '');
      assert(el.innerHTML === '');
      update('1\n\n2\n\n9');
      assert(el.innerHTML === '<p>1</p><p>2</p><p>9</p>');
      update('1\n\n0\n\n9');
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
      update('1\n\n2\n\n3\n\n9');
      assert(el.innerHTML === '<p>1</p><p>2</p><p>3</p><p>9</p>');
      update('1\n\n0\n\n9');
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
      update('9\n\n0\n\n1');
      assert(el.innerHTML === '<p>9</p><p>0</p><p>1</p>');
      update('1\n\n0\n\n1');
      assert(el.innerHTML === '<p>1</p><p>0</p><p>1</p>');
      update('1\n\n0\n\n9\n\n'.repeat(1));
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
      update('1\n\n0\n\n9\n\n'.repeat(1));
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
      update('1\n\n0\n\n9\n\n'.repeat(2));
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><p>1</p><p>0</p><p>9</p>');
      update('1\n\n0\n\n9\n\n'.repeat(1));
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
    });

  });

});
