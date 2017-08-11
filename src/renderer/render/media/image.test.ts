import { image } from './image';
import DOM from 'typed-dom';

describe('Unit: renderer/render/media/image', () => {
  describe('image', () => {
    it('result', () => {
      assert(image(DOM.img({ 'data-src': '/', alt: '' }, '').element) instanceof HTMLImageElement);
      assert(image(DOM.img({ 'data-src': '/', alt: '' }, '').element).getAttribute('src') === '/');
      assert(image(DOM.img({ 'data-src': '/', alt: '' }, '').element).getAttribute('alt') === '');
      assert(image(DOM.a({ img: DOM.img({ 'data-src': '/', alt: '' }, '') }).children.img.element) instanceof HTMLAnchorElement);
    });

  });

});
