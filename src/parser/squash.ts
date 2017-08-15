export function squash(nodes: Node[] | NodeList): DocumentFragment {
  const frag = document.createDocumentFragment();
  for (const curr of Array.from(nodes)) {
    const prev = frag.lastChild;
    if (prev && prev.nodeType === 3 && curr.nodeType === 3) {
      prev.textContent += curr.textContent!;
      curr.textContent = '';
    }
    else {
      void frag.appendChild(curr);
    }
  }
  return frag;
}
