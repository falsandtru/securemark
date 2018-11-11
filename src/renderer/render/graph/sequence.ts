import { define } from 'typed-dom';

declare const Diagram: any;

export function sequence(target: HTMLElement): void {
  assert(target.children.length === 0);
  void requestAnimationFrame(() => {
    const diagram = Diagram.parse(target.textContent!);
    void define(target, []);
    void diagram.drawSVG(target, { theme: 'simple' });
    void target.querySelectorAll<HTMLAnchorElement>('svg a')
      .forEach(el =>
        void el.removeAttribute('href'));
    const svg = target.querySelector('svg')!;
    svg.style.maxHeight = `${Math.round(parseFloat(svg.getAttribute('height')!) * svg.clientWidth / parseFloat(svg.getAttribute('width')!))}`;
  });
}
