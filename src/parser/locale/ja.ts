const endings = /[、。！？…]/;

export function japanese(char: string): boolean {
  assert([...char].length == 1);
  return char.search(endings) === 0;
}
