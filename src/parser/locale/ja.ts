const endings = /^[、。！？]/;

export function japanese(char: string): boolean {
  return endings.test(char);
}
