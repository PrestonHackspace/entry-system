import * as pathToRegexp from 'path-to-regexp';

interface PatternCache {
  [cacheKey: string]: {
    [pattern: string]: {
      re: RegExp;
      keys: pathToRegexp.Key[];
    },
  };
}

const patternCache: PatternCache = {};
const cacheLimit = 10000;
let cacheCount = 0;

const compilePath = (pattern: string, options: pathToRegexp.RegExpOptions & pathToRegexp.ParseOptions) => {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

  if (cache[pattern]) return cache[pattern];

  const keys: pathToRegexp.Key[] = [];
  const re = pathToRegexp(pattern, keys, options);
  const compiledPattern = { re, keys };

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern;
    cacheCount++;
  }

  return compiledPattern;
};

interface Options {
  path: string;
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
}

/**
 * Public API for matching a URL pathname to a path pattern.
 */
const matchPath = (pathname: string, options: Options) => {
  const { path, exact = false, strict = false, sensitive = false } = options;

  const { re, keys } = compilePath(path, { end: exact, strict, sensitive });
  const match = re.exec(pathname);

  if (!match) return null;

  const [url, ...values] = match;
  const isExact = pathname === url;

  if (exact && !isExact) return null;

  return {
    path, // the path pattern used to match
    url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
    isExact, // whether or not we matched exactly
    params: keys.reduce((memo, key, index) => {
      memo[key.name] = values[index];
      return memo;
    }, {} as { [keyName: string]: string }),
  };
};

export default matchPath;
