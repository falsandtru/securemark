import DOM from 'typed-dom';

export function youtube(url: string): HTMLElement {
  return DOM.div({
    style: 'position: relative;',
  }, [
    DOM.div({
      style: 'position: relative; padding-top: 56.25%;',
    }, [
      DOM.iframe({
        src: `https://www.youtube.com/embed/${
          url.startsWith('https://www.youtube.com/') && url.replace(/.+?=/, '').replace(/&/, '?') ||
          url.startsWith('https://youtu.be/') && url.slice(url.indexOf('/', 9) + 1)
        }`,
        allowfullscreen: '',
        frameborder: '0',
        style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;',
      }),
    ]),
  ]).element;
}
