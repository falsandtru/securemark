import { render as render_ } from './render';
import { RenderingOptions } from '../../';
import { parse } from '../parser/api/parse';

function render(target: HTMLElement, opts: RenderingOptions = {}): HTMLElement {
  render_(target, opts);
  return target;
}

describe('Unit: renderer/render', () => {
  describe('render', () => {
    it('code', () => {
      assert(render(parse('`${E = mc^2}$`').querySelector('p')!).querySelector('code'));
      assert(render(parse('```\n${E = mc^2}$\n```').querySelector('pre')!).matches('pre'));
    });

    it('math', () => {
      assert(render(parse('${E = mc^2}$').querySelector('p')!).querySelector('.math'));
      assert(render(parse('$$\nE = mc^2\n$$').querySelector('div')!).matches('.math'));
    });

    it('media', () => {
      // image
      assert(render(parse('!https://pbs.twimg.com/media/C-RAIleV0AAO81x.jpg').querySelector('p')!).querySelector('img')!.matches('p > a > img'));
      assert(render(parse('[!{https://pbs.twimg.com/media/C-RAIleV0AAO81x.jpg}]{#}').querySelector('p')!).querySelector('img')!.matches('p > a > img'));
      // other
      assert(render(parse('!http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf').querySelector('p')!).querySelector('.media')!.matches('p > .media'));
      assert(render(parse('[!{http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf}]{#}').querySelector('p')!).querySelector('.media')!.matches('p > .media'));
      // all
      assert(render(parse([
        '!https://youtu.be/xRF7WIZV4lA',
        '!https://gist.github.com/falsandtru/cdf4a19b70012b0d6e3c9e1ec021e557',
        '!https://www.slideshare.net/Slideshare/an-overview-to-slideshare-for-business',
        '!http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf',
        '!https://twitter.com/hourenso_u/status/856828123882676225?hide_thread=true',
        '!https://pbs.twimg.com/media/C-RAIleV0AAO81x.jpg',
      ].join('\n')).querySelector('p')!).querySelectorAll('.media').length === 6);
    });

  });

});
