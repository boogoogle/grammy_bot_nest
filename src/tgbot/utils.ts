export function checkUsername(s: string) {
  return s && s.length < 8;
}

export function checkAddress(s: string) {
  return s && s.length == 42;
}
