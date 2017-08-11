import { pdf } from './pdf';

describe('Unit: renderer/render/media/pdf', () => {
  describe('pdf', () => {
    it('result', () => {
      assert(!pdf('http://example.pdf'));
      assert(pdf('http://example.com/example.pdf'));
      assert(pdf('http://example.com/example.pdf')!.querySelector('object')!.getAttribute('type') === 'application/pdf');
      assert(pdf('http://example.com/example.pdf')!.querySelector('object')!.typeMustMatch === true);
    });

  });

});
