export const enum Syntax {
  reference = 1 << 12,
  comment = 1 << 11,
  index = 1 << 10,
  placeholder = 1 << 9,
  link = 1 << 8,
  bracket = 1 << 7,
  media = 1 << 6,
  annotation = 1 << 5,
  mathbracket = 1 << 4,
  html = 1 << 3,
  math = 1 << 2,
  autolink = 1 << 1,
  quote = 1 << 0,
  none = 0,
}

export const enum State {
  annotation = 1 << 6,
  reference = 1 << 5,
  index = 1 << 4,
  label = 1 << 3,
  link = 1 << 2,
  media = 1 << 1,
  autolink = 1 << 0,
}
export const backtrackable = 0
  | State.annotation
  | State.reference
  | State.index
  | State.link
  | State.media;
