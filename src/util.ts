export function copyBasedOnDestination(dest: object, src: object) {
  for (let key in dest) {
    // dest[key] = src.hasOwnProperty(key) ? src[key] : null;
    if (src.hasOwnProperty(key)) {
      dest[key] = src[key];
    }
  }

  return dest;
}
