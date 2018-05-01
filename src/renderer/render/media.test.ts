import { media } from './media';
import { html } from 'typed-dom';

describe('Unit: renderer/render/media', () => {

  function image(url: string) {
    return html('img', { 'data-src': url });
  }

  describe('media', () => {
    it('twitter', done => {
      media(image('http://twitter.com/hourenso_u/status/856828123882676225'), {
        twitter: () => done(false) || html('div')
      });
      media(image('https://twitter.com/hourenso_u/status/856828123882676225'), {
        twitter: () => done() || html('div')
      });
    });

    it('youtube', done => {
      media(image('http://youtu.be/xRF7WIZV4lA'), {
        youtube: () => done(false) || html('div')
      });
      media(image('https://youtu.be/xRF7WIZV4lA'), {
        youtube: () => done() || html('div')
      });
      media(image('http://www.youtube.com/watch?v=xRF7WIZV4lA'), {
        youtube: () => done(false) || html('div')
      });
      media(image('https://www.youtube.com/watch?v=xRF7WIZV4lA'), {
        youtube: () => done() || html('div')
      });
    });

    it('gist', done => {
      media(image('http://gist.github.com/falsandtru/cdf4a19b70012b0d6e3c9e1ec021e557'), {
        gist: () => done(false) || html('div')
      });
      media(image('https://gist.github.com/falsandtru/cdf4a19b70012b0d6e3c9e1ec021e557'), {
        gist: () => done() || html('div')
      });
    });

    it('slideshare', done => {
      media(image('http://www.slideshare.net/Slideshare/get-started-with-slide-share'), {
        slideshare: () => done(false) || html('div')
      });
      media(image('https://www.slideshare.net/Slideshare/get-started-with-slide-share'), {
        slideshare: () => done() || html('div')
      });
    });

    it('pdf', done => {
      media(image('http://example.pdf'), {
        pdf: () => done(false) || html('div')
      });
      assert(media(image('http://example.com/example.pdf'), {})!.querySelector('object')!.getAttribute('type') === 'application/pdf');
      assert(media(image('http://example.com/example.pdf'), {})!.querySelector('object')!.typeMustMatch === true);
      done();
    });

    it('image', () => {
      assert(media(image('/'), {})!.getAttribute('src') === new URL('/', location.href).href);
      assert(media(image('/'), {})!.getAttribute('alt') === '');
    });

  });

});
