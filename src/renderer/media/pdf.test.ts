import { pdf } from './pdf';
import DOM from 'typed-dom';

describe('Unit: renderer/media/pdf', () => {
  describe('pdf', () => {
    it('result', () => {
      assert(!pdf(DOM.img({ 'data-src': 'http://example.pdf' }, '').element));
      assert(pdf(DOM.img({ 'data-src': 'http://example.com/example.pdf' }, '').element));
      assert(pdf(DOM.img({ 'data-src': 'http://example.com/example.pdf' }, '').element)!.querySelector('object')!.getAttribute('type') === 'application/pdf');
      assert(pdf(DOM.img({ 'data-src': 'http://example.com/example.pdf' }, '').element)!.querySelector('object')!.typeMustMatch === true);
    });

  });

});
