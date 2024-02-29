export function copyBasedOnDestination(dest: object, src: object) {
  // console.log('util::copyBasedOnDestination(): dest:', dest);
  // console.log('util::copyBasedOnDestination(): src:', src);

  for (let key in dest) {
    // dest[key] = src.hasOwnProperty(key) ? src[key] : null;
    if (src.hasOwnProperty(key)) {
      dest[key] = src[key];
    }
  }

  return dest;
}
