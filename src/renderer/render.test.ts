import { render } from './render';
import { parse } from './parser';

describe('Unit: renderer/render', () => {
  describe('render', () => {
    it('result', () => {
      Array.from(parse(`
$E = mc^2$

$$
\frac{\pi}{2} =
\left(\int_{0}^{\infty} \frac{\sin x}{\sqrt{x}} dx \right)^2 =
\sum_{k=0}^{\infty} \frac{(2k)!}{2^{2k}(k!)^2} \frac{1}{2k+1} =
\prod_{k=1}^{\infty} \frac{4k^2}{4k^2 - 1}
$$

!https://youtu.be/xRF7WIZV4lA
!https://gist.github.com/falsandtru/cdf4a19b70012b0d6e3c9e1ec021e557
!https://www.slideshare.net/Slideshare/an-overview-to-slideshare-for-business
!http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf
!https://twitter.com/hourenso_u/status/856828123882676225?hide_thread=true
!https://pbs.twimg.com/media/C-RAIleV0AAO81x.jpg
      `.trim()).children)
        .forEach(render);
    });

  });

});
