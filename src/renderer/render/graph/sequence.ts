import { define } from 'typed-dom';

declare const Diagram: any;

export function sequence(target: HTMLElement): void {
  assert(target.children.length === 0);
  if (typeof Diagram === 'undefined') return;
  void requestAnimationFrame(() => {
    const observer = new MutationObserver(() => {
      void observer.disconnect();
      void target.querySelectorAll<HTMLAnchorElement>('svg a')
        .forEach(el =>
          void el.removeAttribute('href'));
    });
    const diagram = Diagram.parse(target.textContent!);
    void define(target, []);
    void observer.observe(target, { childList: true });
    void diagram.drawSVG(target, { theme: 'simple' });
  });
}
