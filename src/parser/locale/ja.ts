const endings = /[、。！？]/;

export function japanese(char: string): boolean {
  return char.search(endings) === 0;
}
