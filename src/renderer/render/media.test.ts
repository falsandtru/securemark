import { media } from './media';
import { parse } from '../../parser';
import { html } from 'typed-dom';

describe('Unit: renderer/render/media', () => {

  describe('media', () => {
    it('twitter', done => {
      media(parse('!http://twitter.com/hourenso_u/status/856828123882676225').querySelector('img')!, {
        twitter: () => void done(false) || html('div')
      });
      media(parse('!https://twitter.com/hourenso_u/status/856828123882676225').querySelector('img')!, {
        twitter: () => void done() || html('div')
      });
    });

    it('youtube', done => {
      media(parse('!http://youtu.be/xRF7WIZV4lA').querySelector('img')!, {
        youtube: () => void done(false) || html('div')
      });
      media(parse('!https://youtu.be/xRF7WIZV4lA').querySelector('img')!, {
        youtube: () => void done() || html('div')
      });
      media(parse('!http://www.youtube.com/watch?v=xRF7WIZV4lA').querySelector('img')!, {
        youtube: () => void done(false) || html('div')
      });
      media(parse('!https://www.youtube.com/watch?v=xRF7WIZV4lA').querySelector('img')!, {
        youtube: () => void done() || html('div')
      });
    });

    it('gist', done => {
      media(parse('!http://gist.github.com/falsandtru/cdf4a19b70012b0d6e3c9e1ec021e557').querySelector('img')!, {
        gist: () => void done(false) || html('div')
      });
      media(parse('!https://gist.github.com/falsandtru/cdf4a19b70012b0d6e3c9e1ec021e557').querySelector('img')!, {
        gist: () => void done() || html('div')
      });
    });

    it('slideshare', done => {
      media(parse('!http://www.slideshare.net/Slideshare/get-started-with-slide-share').querySelector('img')!, {
        slideshare: () => void done(false) || html('div')
      });
      media(parse('!https://www.slideshare.net/Slideshare/get-started-with-slide-share').querySelector('img')!, {
        slideshare: () => void done() || html('div')
      });
    });

    it('pdf', done => {
      media(parse('!http://example.pdf').querySelector('img')!, {
        pdf: () => void done(false) || html('div')
      });
      assert(media(parse('!http://example.com/example.pdf').querySelector('img')!, {})!.querySelector('object')!.getAttribute('type') === 'application/pdf');
      done();
    });

    it('image', () => {
      assert(media(parse('!{/}').querySelector('img')!, {})!.matches(`[src="${new URL('/', location.href).href}"][alt=""]`));
    });

  });

});
