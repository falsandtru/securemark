import DOM from 'typed-dom';

export function youtube(url: string): HTMLElement {
  if (!url.startsWith('https://youtu.be/') && !url.startsWith('https://www.youtube.com/watch?v=')) throw new Error(`Invalid youtube url: ${url}`);
  return DOM.div({
    class: 'media',
    style: 'position: relative;',
  }, [
    DOM.div({
      style: 'position: relative; padding-top: 56.25%;',
    }, [
      DOM.iframe({
        src: `https://www.youtube.com/embed/${
          url.startsWith('https://youtu.be/') && url.slice(url.indexOf('/', 9) + 1) ||
          url.startsWith('https://www.youtube.com/watch?v=') && url.replace(/.+?=/, '').replace(/&/, '?')
        }`,
        sandbox: 'allow-scripts allow-same-origin allow-presentation',
        allowfullscreen: '',
        frameborder: '0',
        style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;',
      }),
    ]),
  ]).element;
}
