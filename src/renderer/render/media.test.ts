import { media } from './media';
import { parse } from '../../parser';
import { html } from 'typed-dom';

describe('Unit: renderer/render/media', () => {

  describe('media', () => {
    it('twitter', done => {
      media(location.href, parse('!http://twitter.com/hourenso_u/status/856828123882676225').querySelector('img')!, {
        twitter: () => void done(false) || html('div')
      });
      media(location.href, parse('!https://twitter.com/hourenso_u/status/856828123882676225').querySelector('img')!, {
        twitter: () => void done() || html('div')
      });
    });

    it('youtube', done => {
      media(location.href, parse('!http://youtu.be/xRF7WIZV4lA').querySelector('img')!, {
        youtube: () => void done(false) || html('div')
      });
      media(location.href, parse('!https://youtu.be/xRF7WIZV4lA').querySelector('img')!, {
        youtube: () => void done() || html('div')
      });
      media(location.href, parse('!http://www.youtube.com/watch?v=xRF7WIZV4lA').querySelector('img')!, {
        youtube: () => void done(false) || html('div')
      });
      media(location.href, parse('!https://www.youtube.com/watch?v=xRF7WIZV4lA').querySelector('img')!, {
        youtube: () => void done() || html('div')
      });
    });

    it('pdf', done => {
      media(location.href, parse('!http://example.pdf').querySelector('img')!, {
        pdf: () => void done(false) || html('div')
      });
      assert(media(location.href, parse('!http://example/example.pdf').querySelector('img')!, {})!.querySelector('object')!.getAttribute('type') === 'application/pdf');
      done();
    });

    it('image', () => {
      assert(media(location.href, parse('!{/}').querySelector('img')!, {})!.matches(`[src="${new URL('/', location.href).href}"][alt=""]`));
    });

  });

});
