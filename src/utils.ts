export function getSrc(input: string) {
  if (typeof input !== "string") {
    throw new TypeError("getSrc expected a string");
  }

  const srcRegEx = /src="(.*?)"/gm;
  const matches = srcRegEx.exec(input);

  if (matches && matches.length >= 2) {
    return matches[1];
  }

  return undefined;
}

export function sanitizeUrl(input: string) {
  if (typeof input !== "string") {
    throw new TypeError(`sanitizeUrl expected a string, got ${typeof input}`);
  }

  let sanitized = input;

  if (/<iframe/gi.test(sanitized)) {
    sanitized = getSrc(sanitized) ?? "";
  }

  // Remove surrounding whitespaces or linefeeds
  sanitized = sanitized.trim();

  // Remove any leading `www.`
  sanitized = sanitized.replace("/www.", "/");

  return sanitized;
}
