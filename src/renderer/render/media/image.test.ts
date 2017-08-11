import { image } from './image';
import DOM from 'typed-dom';

describe('Unit: renderer/render/media/image', () => {
  describe('image', () => {
    it('result', () => {
      assert(image(DOM.img({ 'data-src': '/' }, '').element).getAttribute('src') === '/');
      assert(image(DOM.img({ 'data-src': '/' }, '').element) instanceof HTMLImageElement);
      assert(image(DOM.a({ img: DOM.img({ 'data-src': '/' }, '') }).children.img.element) instanceof HTMLAnchorElement);
    });

  });

});
