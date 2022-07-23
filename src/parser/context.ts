export const enum Syntax {
  reference = 1 << 13,
  comment = 1 << 12,
  index = 1 << 11,
  placeholder = 1 << 10,
  ruby = 1 << 9,
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
  annotation = 1 << 7,
  reference = 1 << 6,
  index = 1 << 5,
  label = 1 << 4,
  link = 1 << 3,
  media = 1 << 2,
  autolink = 1 << 1,
  shortcut = 1 << 0,
  none = 0,
  all = ~0,
  linkable = 0
    | State.annotation
    | State.reference
    | State.index
    | State.label
    | State.link
    | State.media
    | State.autolink,
  backtrackable = 0
    | State.annotation
    | State.reference
    | State.index
    | State.link
    | State.media,
}
